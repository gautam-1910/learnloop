# 🔁 LearnLoop — Learning Habit Tracker

> A full-stack habit tracker for micro-learning, spaced repetition, and course progress. Built for the Sayone Tech Full Stack Intern coding assignment.

![Python](https://img.shields.io/badge/Python-FastAPI-3776AB?logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black)
![SQLite](https://img.shields.io/badge/Database-SQLite-07405e?logo=sqlite&logoColor=white)
![Recharts](https://img.shields.io/badge/Charts-Recharts-8884d8)

---

## ✨ Features

| | Feature |
|---|---|
| 📝 | **Create learning habits** — topic, category, frequency, estimated time, start date |
| ⏱️ | **Log study sessions** — duration, notes, date |
| 🔥 | **Streak & progress tracking** — current streak, total hours, completion % |
| 🧠 | **Retention score** — exponential decay model based on days since last session (spaced-repetition inspired) |
| 💡 | **AI-style "Suggest Next Topic"** — recommends the habit with lowest retention score |
| 📅 | **Best study day analysis** — most frequent day of the week from session history |
| 📊 | **Visual analytics** — pie chart (completion) and bar chart (hours/sessions/streak) via Recharts |
| 🏷️ | **Categorization** — organize habits by subject |
| 🔐 | **Mocked authentication** — simple name/email login |

---

## 🛠️ Tech Stack

- **Backend:** FastAPI + SQLite
- **Frontend:** React (Vite) + React Router + Recharts + Axios
- **Auth:** Mocked (client-side only, no backend auth)

---

## 🚀 Setup

### Backend
```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
```
Runs on `http://127.0.0.1:8000` — API docs at `http://127.0.0.1:8000/docs`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

---

## 📁 Project Structure

​```
learnloop/
├── backend/
│   ├── main.py
│   └── learnloop.db
└── frontend/
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   ├── Habits.jsx
        │   └── Analytics.jsx
        ├── api.js
        └── App.jsx
​```

---

## 🔑 Environment Variables

None required. The SQLite database is created locally as `learnloop.db`, and the backend URL is hardcoded in `frontend/src/api.js` (`http://127.0.0.1:8000`) for local development.

---

## 🧠 How Retention Score Works

retention_score = 100 × e^(-0.1 × days_since_last_session)

The longer a topic goes unreviewed, the faster its retention score decays — modeling the "forgetting curve" from spaced-repetition learning theory. The **Suggest Next Topic** feature scans all habits and recommends whichever has the lowest score.

---

## 📌 Notes

- Auth is mocked for this assignment's scope — habits/sessions aren't scoped per-user yet; a `user_id` column could be added to support that.
- "Best study day" uses date-only granularity (no time-of-day stored).
- CORS is configured to allow requests from `http://localhost:5173`.
