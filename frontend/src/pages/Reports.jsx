import { useEffect, useState } from "react";
import { studentsApi, paymentsApi, roomsApi } from "../services/api.js";

const money = (n) => "Rs. " + Number(n || 0).toLocaleString("en-IN");

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [s, p, r] = await Promise.all([studentsApi.list(), paymentsApi.list(), roomsApi.list()]);
        setStudents(s);
        setPayments(p);
        setRooms(r);
      } catch {
        setError("Could not reach the API. Is the backend running on port 5000?");
      }
    })();
  }, []);

  const downloadCsv = () => {
    const rows = [
      ["Receipt", "Student", "Type", "Amount", "Paid", "Status", "Date"],
      ...payments.map((p) => [
        p.receipt,
        p.student?.name || "",
        p.type,
        p.amount,
        p.paid,
        p.status,
        new Date(p.date).toLocaleDateString("en-GB")
      ])
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeStudents = students.filter((s) => s.status === "Active").length;
  const collected = payments.reduce((sum, p) => sum + p.paid, 0);
  const totalBilled = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Snapshot of hostel activity</p>
        </div>
        <button className="btn" onClick={downloadCsv} disabled={payments.length === 0}>Download payments CSV</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="card-grid">
        <div className="info-card"><h3>{students.length}</h3><p>Total students</p></div>
        <div className="info-card"><h3>{activeStudents}</h3><p>Active students</p></div>
        <div className="info-card"><h3>{rooms.length}</h3><p>Rooms registered</p></div>
        <div className="info-card"><h3>{money(collected)}</h3><p>Total collected</p></div>
        <div className="info-card"><h3>{money(totalBilled)}</h3><p>Total billed</p></div>
        <div className="info-card"><h3>{payments.length}</h3><p>Payment records</p></div>
      </div>
    </div>
  );
}
