import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { studentsApi } from "../services/api.js";
import Toast from "../components/Toast.jsx";

const initials = (name) =>
  name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const emptyForm = { name: "", rollNo: "", department: "", year: "", phone: "", email: "", status: "Active" };

export default function Students() {
  const [params] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState(params.get("q") || "");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const data = await studentsApi.list();
      setStudents(data);
    } catch {
      setError("Could not reach the API. Is the backend running on port 5000?");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return notify("Enter a student name");
    try {
      await studentsApi.create(form);
      setShowModal(false);
      setForm(emptyForm);
      notify("Student admitted");
      load();
    } catch {
      notify("Could not save student");
    }
  };

  const handleDelete = async (id) => {
    try {
      await studentsApi.remove(id);
      notify("Student removed");
      load();
    } catch {
      notify("Could not remove student");
    }
  };

  const filtered = students.filter((s) => {
    const q = query.toLowerCase();
    const matchesQ =
      !q || [s.name, s.rollNo, s.phone, s.email].filter(Boolean).join(" ").toLowerCase().includes(q);
    const matchesS = !statusFilter || s.status === statusFilter;
    return matchesQ && matchesS;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p>{students.length} students registered</p>
        </div>
        <button className="btn" onClick={() => setShowModal(true)}>+ Add student</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="toolbar">
        <input
          className="search"
          placeholder="Search by name, roll no, email or phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th><th>Roll no.</th><th>Department</th><th>Phone</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr><td colSpan="6"><div className="empty">No students yet. Click "Add student" to get started.</div></td></tr>
          )}
          {filtered.map((s) => (
            <tr key={s._id}>
              <td>
                <div className="name-cell">
                  <div className="avatar sm">{initials(s.name)}</div>
                  {s.name}
                </div>
              </td>
              <td>{s.rollNo || "-"}</td>
              <td>{s.department || "-"}</td>
              <td>{s.phone || "-"}</td>
              <td><span className={`badge badge-${s.status.toLowerCase()}`}>{s.status}</span></td>
              <td>
                <div className="row-actions">
                  <span onClick={() => handleDelete(s._id)} title="Remove">&#128465;</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-footer">Showing {filtered.length} of {students.length} students</div>

      {showModal && (
        <div className="modal-overlay active">
          <div className="modal">
            <h2>Add student</h2>
            <div className="field">
              <label>Full name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Priya Sharma" />
            </div>
            <div className="field">
              <label>Roll no.</label>
              <input value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} placeholder="e.g. 21" />
            </div>
            <div className="field">
              <label>Department</label>
              <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. CSE" />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. 9876543210" />
            </div>
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => { setShowModal(false); setForm(emptyForm); }}>Cancel</button>
              <button className="btn" onClick={handleSave}>Save student</button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
