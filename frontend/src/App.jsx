import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Habits from "./pages/Habits";
import Analytics from "./pages/Analytics";

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <BrowserRouter>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between" }}>
        <div>
          <Link to="/" style={{ marginRight: "1rem" }}>Habits</Link>
          <Link to="/analytics">Analytics</Link>
        </div>
        <div>
          <span style={{ marginRight: "1rem" }}>{user.name}</span>
          <button onClick={() => setUser(null)}>Log Out</button>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Habits />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;