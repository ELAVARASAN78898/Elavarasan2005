import { useEffect, useState } from "react";
import { studentsApi, paymentsApi, roomsApi } from "../services/api.js";

const money = (n) => "Rs. " + Number(n || 0).toLocaleString("en-IN");

export default function Dashboard() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [summary, setSummary] = useState({ collected: 0, pending: 0, total: 0 });
  const [roomCount, setRoomCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [students, paySummary, rooms] = await Promise.all([
          studentsApi.list(),
          paymentsApi.summary(),
          roomsApi.list()
        ]);
        setTotalStudents(students.length);
        setSummary(paySummary);
        setRoomCount(rooms.length);
      } catch (err) {
        setError("Could not reach the API. Is the backend running on port 5000?");
      }
    })();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your hostel</p>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="stats-row">
        <div className="stat-card stat-purple">
          <div className="label">Total students</div>
          <div className="value">{totalStudents}</div>
        </div>
        <div className="stat-card stat-pink">
          <div className="label">Pending payments</div>
          <div className="value">{money(summary.pending)}</div>
        </div>
        <div className="stat-card stat-blue">
          <div className="label">Collected</div>
          <div className="value">{money(summary.collected)}</div>
        </div>
      </div>

      <div className="card-grid">
        <div className="info-card">
          <h3>{roomCount}</h3>
          <p>Rooms registered</p>
        </div>
        <div className="info-card">
          <h3>{money(summary.total)}</h3>
          <p>Total billed</p>
        </div>
      </div>
    </div>
  );
}
