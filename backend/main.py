import sqlite3
import math
from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    conn = sqlite3.connect("learnloop.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT NOT NULL,
            category TEXT,
            frequency TEXT,
            estimated_minutes INTEGER,
            start_date TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            habit_id INTEGER,
            duration_minutes INTEGER,
            notes TEXT,
            session_date TEXT,
            FOREIGN KEY (habit_id) REFERENCES habits (id)
        )
    """)
    conn.commit()
    conn.close()

init_db()

class HabitCreate(BaseModel):
    topic: str
    category: str
    frequency: str
    estimated_minutes: int
    start_date: str

@app.post("/habits")
def create_habit(habit: HabitCreate):
    conn = get_db()
    cursor = conn.execute(
        "INSERT INTO habits (topic, category, frequency, estimated_minutes, start_date) VALUES (?, ?, ?, ?, ?)",
        (habit.topic, habit.category, habit.frequency, habit.estimated_minutes, habit.start_date)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {"id": new_id, **habit.dict()}

@app.get("/habits")
def list_habits():
    conn = get_db()
    rows = conn.execute("SELECT * FROM habits").fetchall()
    conn.close()
    return [dict(row) for row in rows]


class SessionCreate(BaseModel):
    habit_id: int
    duration_minutes: int
    notes: str
    session_date: Optional[str] = None

@app.post("/sessions")
def create_session(session: SessionCreate):
    conn = get_db()
    session_date = session.session_date or str(date.today())
    cursor = conn.execute(
        "INSERT INTO sessions (habit_id, duration_minutes, notes, session_date) VALUES (?, ?, ?, ?)",
        (session.habit_id, session.duration_minutes, session.notes, session_date)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {"id": new_id, "habit_id": session.habit_id, "duration_minutes": session.duration_minutes, "notes": session.notes, "session_date": session_date}

@app.get("/sessions/{habit_id}")
def get_sessions(habit_id: int):
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM sessions WHERE habit_id = ? ORDER BY session_date ASC", (habit_id,)
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]
@app.get("/analytics/{habit_id}")
def get_analytics(habit_id: int):
    conn = get_db()
    habit = conn.execute("SELECT * FROM habits WHERE id = ?", (habit_id,)).fetchone()
    sessions = conn.execute(
        "SELECT * FROM sessions WHERE habit_id = ? ORDER BY session_date ASC", (habit_id,)
    ).fetchall()
    conn.close()

    if not habit:
        return {"error": "Habit not found"}

    total_minutes = sum(s["duration_minutes"] for s in sessions)
    total_hours = round(total_minutes / 60, 2)

    session_dates = sorted(set(s["session_date"] for s in sessions))
    streak = 0
    if session_dates:
        streak = 1
        for i in range(len(session_dates) - 1, 0, -1):
            current = datetime.strptime(session_dates[i], "%Y-%m-%d")
            previous = datetime.strptime(session_dates[i - 1], "%Y-%m-%d")
            if (current - previous).days == 1:
                streak += 1
            else:
                break

    start = datetime.strptime(habit["start_date"], "%Y-%m-%d")
    days_since_start = (datetime.today() - start).days + 1
    completion_percent = round((len(session_dates) / days_since_start) * 100, 1) if days_since_start > 0 else 0

    if session_dates:
        last_session = datetime.strptime(session_dates[-1], "%Y-%m-%d")
        days_since_last = (datetime.today() - last_session).days
    else:
        days_since_last = None

    decay_rate = 0.1
    if days_since_last is not None:
        retention_score = round(100 * math.exp(-decay_rate * days_since_last), 1)
    else:
        retention_score = 0

    return {
        "habit_id": habit_id,
        "topic": habit["topic"],
        "total_hours": total_hours,
        "current_streak": streak,
        "completion_percent": completion_percent,
        "total_sessions": len(sessions),
        "retention_score": retention_score
    }
