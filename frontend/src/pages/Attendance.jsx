import { useEffect, useState } from "react";
import { attendanceApi, studentsApi } from "../services/api.js";
import Toast from "../components/Toast.jsx";

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(todayStr());
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const load = async (d) => {
    try {
      const [studentList, attendanceList] = await Promise.all([
        studentsApi.list(),
        attendanceApi.list(d)
      ]);
      setStudents(studentList);
      setRecords(attendanceList);
    } catch {
      setError("Could not reach the API. Is the backend running on port 5000?");
    }
  };

  useEffect(() => { load(date); }, [date]);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  const statusFor = (studentId) => records.find((r) => r.student?._id === studentId)?.status || "Present";

  const setStatus = async (studentId, status) => {
    try {
      await attendanceApi.mark({ student: studentId, date, status });
      notify(`Marked ${status.toLowerCase()}`);
      load(date);
    } catch {
      notify("Could not save attendance");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Attendance</h1>
          <p>Mark daily attendance per student</p>
        </div>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {error && <div className="error-banner">{error}</div>}

      <table>
        <thead>
          <tr><th>Name</th><th>Roll no.</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {students.length === 0 && (
            <tr><td colSpan="4"><div className="empty">Add students first to mark attendance.</div></td></tr>
          )}
          {students.map((s) => {
            const status = statusFor(s._id);
            return (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.rollNo || "-"}</td>
                <td><span className={`badge badge-${status.toLowerCase()}`}>{status}</span></td>
                <td>
                  <div className="row-actions" style={{ gap: "14px" }}>
                    <button className="btn secondary" style={{ padding: "4px 10px" }} onClick={() => setStatus(s._id, "Present")}>Present</button>
                    <button className="btn secondary" style={{ padding: "4px 10px" }} onClick={() => setStatus(s._id, "Absent")}>Absent</button>
                    <button className="btn secondary" style={{ padding: "4px 10px" }} onClick={() => setStatus(s._id, "Leave")}>Leave</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Toast message={toast} />
    </div>
  );
}
