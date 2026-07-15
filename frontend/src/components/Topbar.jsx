import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Topbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/students?q=${encodeURIComponent(query)}`);
  };

  return (
    <form className="topbar" onSubmit={handleSearch}>
      <input
        className="search"
        placeholder="Search students..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="date">{today}</div>
    </form>
  );
}
