import { useEffect, useState } from "react";
import { roomsApi } from "../services/api.js";
import Toast from "../components/Toast.jsx";

const emptyForm = { number: "", floor: "", type: "Double", capacity: 2 };

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setRooms(await roomsApi.list());
    } catch {
      setError("Could not reach the API. Is the backend running on port 5000?");
    }
  };

  useEffect(() => { load(); }, []);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  const handleSave = async () => {
    if (!form.number.trim()) return notify("Enter a room number");
    try {
      await roomsApi.create({ ...form, capacity: Number(form.capacity) });
      setShowModal(false);
      setForm(emptyForm);
      notify("Room added");
      load();
    } catch {
      notify("Could not save room — number may already exist");
    }
  };

  const handleDelete = async (id) => {
    try {
      await roomsApi.remove(id);
      notify("Room removed");
      load();
    } catch {
      notify("Could not remove room");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Rooms</h1>
          <p>{rooms.length} rooms registered</p>
        </div>
        <button className="btn" onClick={() => setShowModal(true)}>+ Add room</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <table>
        <thead>
          <tr><th>Room no.</th><th>Floor</th><th>Type</th><th>Capacity</th><th>Occupied</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {rooms.length === 0 && (
            <tr><td colSpan="7"><div className="empty">No rooms yet. Click "Add room" to get started.</div></td></tr>
          )}
          {rooms.map((r) => (
            <tr key={r._id}>
              <td>{r.number}</td>
              <td>{r.floor || "-"}</td>
              <td>{r.type}</td>
              <td>{r.capacity}</td>
              <td>{r.occupied ?? 0} / {r.bedCount ?? 0}</td>
              <td><span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span></td>
              <td>
                <div className="row-actions">
                  <span onClick={() => handleDelete(r._id)} title="Remove">&#128465;</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay active">
          <div className="modal">
            <h2>Add room</h2>
            <div className="field">
              <label>Room number</label>
              <input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} placeholder="e.g. 204" />
            </div>
            <div className="field">
              <label>Floor</label>
              <input value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} placeholder="e.g. 2nd floor" />
            </div>
            <div className="field">
              <label>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>Single</option><option>Double</option><option>Triple</option><option>Dormitory</option>
              </select>
            </div>
            <div className="field">
              <label>Capacity</label>
              <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => { setShowModal(false); setForm(emptyForm); }}>Cancel</button>
              <button className="btn" onClick={handleSave}>Save room</button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
