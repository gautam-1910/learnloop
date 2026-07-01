import { useState, useEffect } from "react";
import api from "../api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";

const COLORS = ["#4ade80", "#1f2937"];

function Analytics() {
  const [habits, setHabits] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/habits").then((res) => setHabits(res.data));
  }, []);

  const loadAnalytics = async (id) => {
    if (!id) return;
    setLoading(true);
    const res = await api.get(`/analytics/${id}`);
    setData(res.data);
    setLoading(false);
  };

  const handleChange = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    loadAnalytics(id);
  };

  const pieData = data
    ? [
        { name: "Completed", value: data.completion_percent },
        { name: "Remaining", value: 100 - data.completion_percent },
      ]
    : [];

  const barData = data
    ? [
        { name: "Hours", value: data.total_hours },
        { name: "Sessions", value: data.total_sessions },
        { name: "Streak", value: data.current_streak },
      ]
    : [];

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Analytics</h2>
      <select value={selectedId} onChange={handleChange}>
        <option value="">Select a habit</option>
        {habits.map((h) => (
          <option key={h.id} value={h.id}>{h.topic}</option>
        ))}
      </select>

      {loading && <p>Loading...</p>}

      {data && !loading && (
        <div style={{ marginTop: "1rem" }}>
          <h3>{data.topic}</h3>

          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ width: 250, height: 250 }}>
              <p style={{ textAlign: "center" }}>Completion: {data.completion_percent}%</p>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={90}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ width: 300, height: 250 }}>
              <p style={{ textAlign: "center" }}>Overview</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4ade80" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p style={{ marginTop: "1rem" }}>Current streak: {data.current_streak} days 🔥</p>
        </div>
      )}
    </div>
  );
}

export default Analytics;