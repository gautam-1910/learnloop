# LearnLoop

A learning habit tracker built for the Sayone Tech Full Stack Intern coding assignment.

## Tech Stack
- **Backend:** FastAPI + SQLite
- **Frontend:** React (Vite) + React Router + Recharts
- **Auth:** Mocked (name/email captured client-side, no backend auth)

## Features
- Add learning habits (topic, category, frequency, estimated time, start date)
- Log study sessions per habit
- Analytics dashboard per habit:
  - Total hours studied
  - Current streak
  - Completion percentage
  - Retention score (exponential decay based on days since last session — models a forgetting curve)
  - Visualized with a pie chart (completion %) and bar chart (hours/sessions/streak)

## Setup

### Backend
```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
```
Runs on `http://127.0.0.1:8000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

## Project Structure
learnloop/
backend/
main.py
learnloop.db
frontend/
src/
pages/
Login.jsx
Habits.jsx
Analytics.jsx
api.js
App.jsx

## Notes
- Retention score formula: `100 * e^(-0.1 * days_since_last_session)` — encourages revisiting topics before knowledge decays, inspired by spaced-repetition learning theory.
- CORS is configured to allow requests from `http://localhost:5173`.