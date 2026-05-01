# Team Task Manager

A full-stack team collaboration app with role-based access control (Admin/Member), project management, task tracking, and a real-time dashboard.

## Live Demo
> Deployed on Railway — see submission URL

---

## Features

- **Authentication** — Signup & Login with JWT tokens
- **Role-Based Access** — Admin can manage all projects & tasks; Members have scoped access
- **Project Management** — Create projects, invite team members
- **Task Tracking** — Create tasks, assign to members, set due dates, update status (TODO → IN_PROGRESS → REVIEW → DONE)
- **Dashboard** — Overview of tasks by status, overdue tasks, and team workload
- **REST API** — Clean, validated JSON API

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router, Vite |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL (via Prisma ORM) |
| Auth | JWT + bcrypt |
| Deployment | Railway |

---

## Getting Started (Local)

### Prerequisites
- Node.js 18+
- PostgreSQL running locally (or use SQLite by switching schema)

### 1. Clone the repo
```bash
git clone <repo-url>
cd team-task-manager
```

### 2. Set up backend
```bash
cd backend
cp .env.example .env   # fill in DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev
node server.js
```

### 3. Set up frontend (separate terminal)
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

---

## Environment Variables

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql://user:password@localhost:5432/taskmanager
JWT_SECRET=your_strong_secret_here
PORT=5000
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List user's projects |
| POST | `/api/projects` | Create a project (Admin) |
| GET | `/api/projects/:id` | Get project details |
| DELETE | `/api/projects/:id` | Delete project (Admin) |
| POST | `/api/projects/:id/members` | Add member to project |
| DELETE | `/api/projects/:id/members/:userId` | Remove member |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks?projectId=` | List tasks for a project |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update task (status, assignee, etc.) |
| DELETE | `/api/tasks/:id` | Delete task (Admin/Creator) |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get summary stats |

---

## Railway Deployment

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add a **PostgreSQL** service in Railway
4. Set environment variables in Railway dashboard:
   - `DATABASE_URL` → (auto-filled by Railway Postgres plugin)
   - `JWT_SECRET` → your secret
5. Railway auto-runs `npm run build` then starts with `npm start`

---

## License
MIT
