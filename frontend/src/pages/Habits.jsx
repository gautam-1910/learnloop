import { useState, useEffect } from "react";
import api from "../api";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [form, setForm] = useState({
    topic: "",
    category: "",
    frequency: "",
    estimated_minutes: "",
    start_date: "",
  });
  const [sessionForm, setSessionForm] = useState({
    habit_id: "",
    duration_minutes: "",
    notes: "",
    session_date: "",
  });

  const loadHabits = async () => {
    const res = await api.get("/habits");
    setHabits(res.data);
  };

  useEffect(() => {
    loadHabits();
  }, []);
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    api.get("/suggest-next").then((res) => setSuggestion(res.data));
  }, [habits]);

  const handleHabitSubmit = async (e) => {
    e.preventDefault();
    await api.post("/habits", {
      ...form,
      estimated_minutes: Number(form.estimated_minutes),
    });
    setForm({ topic: "", category: "", frequency: "", estimated_minutes: "", start_date: "" });
    loadHabits();
  };

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    await api.post("/sessions", {
      habit_id: Number(sessionForm.habit_id),
      duration_minutes: Number(sessionForm.duration_minutes),
      notes: sessionForm.notes,
      session_date: sessionForm.session_date || null,
    });
    setSessionForm({ habit_id: "", duration_minutes: "", notes: "", session_date: "" });
    alert("Session logged!");
  };

  return (
    <div style={{ padding: "1rem" }}>
        {suggestion && suggestion.suggestion && (
        <div style={{ background: "#1f2937", padding: "1rem", borderRadius: "8px", marginBottom: "1rem", textAlign: "center" }}>
          🧠 {suggestion.message}
        </div>
      )}
      <h2>Add Habit</h2>
      <form onSubmit={handleHabitSubmit}>
        <input placeholder="Topic" value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })} required />
        <input placeholder="Category" value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input placeholder="Frequency" value={form.frequency}
          onChange={(e) => setForm({ ...form, frequency: e.target.value })} />
        <input type="number" placeholder="Estimated minutes" value={form.estimated_minutes}
          onChange={(e) => setForm({ ...form, estimated_minutes: e.target.value })} />
        <input type="date" value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
        <button type="submit">Add Habit</button>
      </form>

      <h2>Your Habits</h2>
      <ul>
        {habits.map((h) => (
          <li key={h.id}>
            {h.topic} — {h.category} ({h.frequency}, {h.estimated_minutes} min)
          </li>
        ))}
      </ul>

      <h2>Log a Session</h2>
      <form onSubmit={handleSessionSubmit}>
        <select value={sessionForm.habit_id}
          onChange={(e) => setSessionForm({ ...sessionForm, habit_id: e.target.value })} required>
          <option value="">Select habit</option>
          {habits.map((h) => (
            <option key={h.id} value={h.id}>{h.topic}</option>
          ))}
        </select>
        <input type="number" placeholder="Duration (minutes)" value={sessionForm.duration_minutes}
          onChange={(e) => setSessionForm({ ...sessionForm, duration_minutes: e.target.value })} required />
        <input placeholder="Notes" value={sessionForm.notes}
          onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })} />
        <input type="date" value={sessionForm.session_date}
          onChange={(e) => setSessionForm({ ...sessionForm, session_date: e.target.value })} />
        <button type="submit">Log Session</button>
      </form>
    </div>
  );
}

export default Habits;
