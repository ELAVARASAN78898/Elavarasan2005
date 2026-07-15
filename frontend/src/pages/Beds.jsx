import { useEffect, useState } from "react";
import { bedsApi, roomsApi } from "../services/api.js";
import Toast from "../components/Toast.jsx";

const emptyForm = { label: "", room: "" };

export default function Beds() {
  const [beds, setBeds] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [bedList, roomList] = await Promise.all([bedsApi.list(), roomsApi.list()]);
      setBeds(bedList);
      setRooms(roomList);
    } catch {
      setError("Could not reach the API. Is the backend running on port 5000?");
    }
  };

  useEffect(() => { load(); }, []);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  const handleSave = async () => {
    if (!form.label.trim() || !form.room) return notify("Enter a bed label and choose a room");
    try {
      await bedsApi.create(form);
      setShowModal(false);
      setForm(emptyForm);
      notify("Bed added");
      load();
    } catch {
      notify("Could not save bed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await bedsApi.remove(id);
      notify("Bed removed");
      load();
    } catch {
      notify("Could not remove bed");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Beds</h1>
          <p>{beds.length} beds registered</p>
        </div>
        <button className="btn" onClick={() => setShowModal(true)} disabled={rooms.length === 0}>+ Add bed</button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {rooms.length === 0 && !error && <div className="error-banner">Add a room first before creating beds.</div>}

      <table>
        <thead>
          <tr><th>Bed</th><th>Room</th><th>Status</th><th>Occupant</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {beds.length === 0 && (
            <tr><td colSpan="5"><div className="empty">No beds yet.</div></td></tr>
          )}
          {beds.map((b) => (
            <tr key={b._id}>
              <td>{b.label}</td>
              <td>{b.room?.number || "-"}</td>
              <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
              <td>{b.occupant?.name || "-"}</td>
              <td>
                <div className="row-actions">
                  <span onClick={() => handleDelete(b._id)} title="Remove">&#128465;</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay active">
          <div className="modal">
            <h2>Add bed</h2>
            <div className="field">
              <label>Bed label</label>
              <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Bed A" />
            </div>
            <div className="field">
              <label>Room</label>
              <select value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })}>
                <option value="">Select room</option>
                {rooms.map((r) => <option key={r._id} value={r._id}>{r.number}</option>)}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => { setShowModal(false); setForm(emptyForm); }}>Cancel</button>
              <button className="btn" onClick={handleSave}>Save bed</button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
