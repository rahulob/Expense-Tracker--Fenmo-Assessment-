Here's a professional README for your Expense Tracker assignment:

***

# Personal Finance Expense Tracker

A full-stack personal finance tool built to track and analyze expenses under real-world conditions. Implemented with React + Vite frontend and FastAPI + MongoDB backend.

## ✨ Live Demo
[Deployed Application Link](https://expense-tracker-fenmo-assessment.vercel.app/)

## 📁 Repository Structure
```
expense-tracker/
├── frontend/           # React + Vite SPA
├── backend/            # FastAPI + MongoDB API
├── README.md
└── docker-compose.yml  # Optional: Local development
```

## 🚀 Features Implemented

### Core Requirements ✅
- **Create expenses**: Dashboard form with amount, category, description, date
- **View expenses**: 
  - Dashboard shows current month expenses
  - Dedicated "View Expenses" page for all expenses
- **Filter by category**: Dropdown filter on View Expenses page
- **Sort by date**: Newest first (default sorting)
- **Total calculation**: Displays total for currently visible expenses
- **Retry resilience**: Idempotent API prevents duplicate entries on retries

### Additional Polish
- Responsive design for mobile/desktop
- Loading states and error handling
- Form validation (positive amounts, required fields)
- Month-based dashboard view

## 🛠 Tech Stack

**Frontend**
- React 18 + Vite (fast dev server, optimized builds)
- Tailwind CSS (rapid styling)
- React Query (API handling, caching, retries)
- React Hook Form (form validation)

**Backend**
- FastAPI (modern, fast, auto-docs)
- MongoDB (flexible schema, good for rapid prototyping)
- Pydantic (data validation)

## 🌐 API Endpoints
End points have category filter built in
```bash
POST /api/expenses/get-all
  # Create expense (idempotent with request_id header)

GET /api/expenses/get-by-time-range
  # List with optional filters/sorting
```

## 🚀 Quick Start
Clone the repo and use the following command to run the app
.env files are needed for both frontend and backend separately


```bash
# Backend (terminal 1)
cd backend
pip install uv
uv sync
uv run main.py

# Frontend (terminal 2)
cd frontend
npm install
npm run dev
```

## ⚠️ Trade-offs & Timebox Decisions

| Feature | Status | Reason |
|---------|--------|--------|
| User auth | ❌ Not implemented | Single-user focus per assignment |
| Categories management | ❌ Hardcoded | Keeps scope minimal |
| Tests | ❌ Minimal | Focused on production behavior |
| Export/CSV | ❌ Nice-to-have | Time ran out |

## 📈 What I'd Add Next (Production)

1. **Multi-user auth** (JWT + refresh tokens)
2. **Category management** (CRUD UI)
3. **Budgeting** (monthly limits)
4. **Charts** (spending trends)
5. **Export** (PDF/CSV)
6. **Unit tests** (80% coverage)

***

**Built for:** Technical Assessment  
**Completed:** February 2026  
**Author:** Rahul Gupta
***