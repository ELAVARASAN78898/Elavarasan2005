import { useEffect, useState } from "react";
import { roomsApi, bedsApi } from "../services/api.js";

export default function Vacancy() {
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [roomList, bedList] = await Promise.all([roomsApi.list(), bedsApi.list()]);
        setRooms(roomList);
        setBeds(bedList);
      } catch {
        setError("Could not reach the API. Is the backend running on port 5000?");
      }
    })();
  }, []);

  const totalBeds = beds.length;
  const occupied = beds.filter((b) => b.status === "Occupied").length;
  const vacant = totalBeds - occupied;
  const occupancyRate = totalBeds ? Math.round((occupied / totalBeds) * 100) : 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Vacancy tracking</h1>
          <p>Live occupancy across rooms and beds</p>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="stats-row">
        <div className="stat-card stat-purple"><div className="label">Total beds</div><div className="value">{totalBeds}</div></div>
        <div className="stat-card stat-pink"><div className="label">Vacant beds</div><div className="value">{vacant}</div></div>
        <div className="stat-card stat-blue"><div className="label">Occupancy rate</div><div className="value">{occupancyRate}%</div></div>
      </div>

      <table>
        <thead>
          <tr><th>Room</th><th>Type</th><th>Capacity</th><th>Occupied</th><th>Vacant</th></tr>
        </thead>
        <tbody>
          {rooms.length === 0 && (
            <tr><td colSpan="5"><div className="empty">No rooms registered yet.</div></td></tr>
          )}
          {rooms.map((r) => (
            <tr key={r._id}>
              <td>{r.number}</td>
              <td>{r.type}</td>
              <td>{r.capacity}</td>
              <td>{r.occupied ?? 0}</td>
              <td>{(r.bedCount ?? 0) - (r.occupied ?? 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
