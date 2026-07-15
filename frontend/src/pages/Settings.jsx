import { useState } from "react";

export default function Settings() {
  const [hostelName, setHostelName] = useState("HostelHub");
  const [warden, setWarden] = useState("Night Warden");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Hostel and account settings</p>
        </div>
      </div>

      <div className="info-card" style={{ maxWidth: 420 }}>
        <div className="field">
          <label>Hostel name</label>
          <input value={hostelName} onChange={(e) => setHostelName(e.target.value)} />
        </div>
        <div className="field">
          <label>Warden name</label>
          <input value={warden} onChange={(e) => setWarden(e.target.value)} />
        </div>
        <button className="btn" onClick={handleSave}>Save changes</button>
        {saved && <p style={{ color: "var(--green)", fontSize: 13, marginTop: 10 }}>Settings saved.</p>}
      </div>
    </div>
  );
}
