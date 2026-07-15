import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "\u25A0", end: true },
  { to: "/students", label: "Students", icon: "\uD83D\uDC64" },
  { to: "/rooms", label: "Rooms", icon: "\uD83D\uDD12" },
  { to: "/beds", label: "Beds", icon: "\uD83D\uDECC" },
  { to: "/attendance", label: "Attendance", icon: "\u2713" },
  { to: "/payments", label: "Payments", icon: "\uD83D\uDCB3" },
  { to: "/vacancy", label: "Vacancy Tracking", icon: "\uD83D\uDCCA" },
  { to: "/reports", label: "Reports", icon: "\uD83D\uDCC4" },
  { to: "/settings", label: "Settings", icon: "\u2699" }
];

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="brand">
        <div className="brand-icon">H</div>
        <div className="brand-name">HostelHub</div>
      </div>
      <ul className="nav">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span className="nav-icon">{link.icon}</span> {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="sidebar-user">
        <div className="avatar">N</div>
        <div className="user-meta">
          Night Warden
          <div className="role">Warden</div>
        </div>
      </div>
      <button className="logout">&#8618; Logout</button>
    </div>
  );
}
