import { useEffect, useState } from "react";
import { paymentsApi, studentsApi } from "../services/api.js";
import Toast from "../components/Toast.jsx";

const money = (n) => "Rs. " + Number(n || 0).toLocaleString("en-IN");
const emptyForm = { student: "", type: "Rent", amount: "", paid: "" };

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({ collected: 0, pending: 0, total: 0 });
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [paymentList, studentList, sum] = await Promise.all([
        paymentsApi.list(),
        studentsApi.list(),
        paymentsApi.summary()
      ]);
      setPayments(paymentList);
      setStudents(studentList);
      setSummary(sum);
    } catch {
      setError("Could not reach the API. Is the backend running on port 5000?");
    }
  };

  useEffect(() => { load(); }, []);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  const handleSave = async () => {
    if (!form.student) return notify("Choose a student");
    const amount = Number(form.amount);
    if (!amount || amount <= 0) return notify("Enter a valid amount");
    try {
      await paymentsApi.create({ ...form, amount, paid: Number(form.paid) || 0 });
      setShowModal(false);
      setForm(emptyForm);
      notify("Payment recorded");
      load();
    } catch {
      notify("Could not save payment");
    }
  };

  const handleDelete = async (id) => {
    try {
      await paymentsApi.remove(id);
      notify("Payment removed");
      load();
    } catch {
      notify("Could not remove payment");
    }
  };

  const filtered = payments.filter((p) => {
    const q = query.toLowerCase();
    const matchesQ = !q || p.receipt.toLowerCase().includes(q);
    const matchesS = !statusFilter || p.status === statusFilter;
    return matchesQ && matchesS;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Payments</h1>
          <p>Fees, receipts and collections</p>
        </div>
        <button className="btn" onClick={() => setShowModal(true)} disabled={students.length === 0}>+ Record payment</button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {students.length === 0 && !error && <div className="error-banner">Add a student first before recording payments.</div>}

      <div className="stats-row">
        <div className="stat-card stat-purple"><div className="label">Collected</div><div className="value">{money(summary.collected)}</div></div>
        <div className="stat-card stat-pink"><div className="label">Pending</div><div className="value">{money(summary.pending)}</div></div>
        <div className="stat-card stat-blue"><div className="label">Total billed</div><div className="value">{money(summary.total)}</div></div>
      </div>

      <div className="toolbar">
        <input className="search" placeholder="Search receipt number..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All status</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <table>
        <thead>
          <tr><th>Receipt</th><th>Student</th><th>Type</th><th>Amount</th><th>Paid</th><th>Status</th><th>Date</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr><td colSpan="8"><div className="empty">No payments recorded yet.</div></td></tr>
          )}
          {filtered.map((p) => (
            <tr key={p._id}>
              <td>{p.receipt}</td>
              <td>{p.student?.name || "-"}</td>
              <td>{p.type}</td>
              <td>{money(p.amount)}</td>
              <td>{money(p.paid)}</td>
              <td><span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span></td>
              <td>{new Date(p.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
              <td>
                <div className="row-actions">
                  <span onClick={() => handleDelete(p._id)} title="Remove">&#128465;</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-footer">{filtered.length} payments</div>

      {showModal && (
        <div className="modal-overlay active">
          <div className="modal">
            <h2>Record payment</h2>
            <div className="field">
              <label>Student</label>
              <select value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })}>
                <option value="">Select student</option>
                {students.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>Rent</option><option>Mess</option><option>Deposit</option><option>Fine</option>
              </select>
            </div>
            <div className="field">
              <label>Total amount (Rs.)</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 10000" />
            </div>
            <div className="field">
              <label>Amount paid now (Rs.)</label>
              <input type="number" value={form.paid} onChange={(e) => setForm({ ...form, paid: e.target.value })} placeholder="e.g. 5000" />
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => { setShowModal(false); setForm(emptyForm); }}>Cancel</button>
              <button className="btn" onClick={handleSave}>Save payment</button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
