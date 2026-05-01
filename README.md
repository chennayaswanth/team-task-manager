# Team Task Manager

A full-stack team collaboration platform with role-based access control (Admin/Member), project management, task tracking, and a real-time dashboard.

**Live Demo:** [Deployed on Vercel](#)

---

## Features

- **Authentication** — Signup & Login with JWT tokens (24h expiry)
- **Role-Based Access** — Admin manages all projects & tasks; Members have scoped access
- **Project Management** — Create projects, add/remove team members
- **Task Tracking** — Create tasks, assign to members, set due dates, update status
- **Task Statuses** — `TODO` → `IN_PROGRESS` → `REVIEW` → `DONE`
- **Dashboard** — Live stats: tasks by status, overdue count, team workload
- **REST API** — Clean, validated JSON API with JWT middleware

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router v7, Vite 8 |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT + bcrypt |
| Hosting | Vercel (frontend + serverless API) |
| DB Host | Neon (free PostgreSQL) |

---

## Project Structure

```
team-task-manager/
├── api/
│   └── index.js          # Vercel serverless function entry
├── backend/
│   ├── app.js            # Express app (exported)
│   ├── server.js         # Local dev server
│   ├── middleware/
│   │   └── auth.js       # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── dashboard.js
│   └── prisma/
│       └── schema.prisma
├── frontend/
│   └── src/
│       ├── pages/        # Dashboard, Login, ProjectList, ProjectDetails
│       ├── components/   # Layout
│       └── api.js        # Fetch wrapper with JWT
├── vercel.json           # Vercel deployment config
└── README.md
```

---

## Getting Started (Local)

### Prerequisites
- Node.js 18+
- PostgreSQL (or use [Neon](https://neon.tech) free tier)

### 1. Clone
```bash
git clone https://github.com/chennayaswanth/team-task-manager
cd team-task-manager
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env       # Add your DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev
node server.js             # Runs on http://localhost:5000
```

### 3. Frontend setup (new terminal)
```bash
cd frontend
npm install
npm run dev                # Runs on http://localhost:5173
```
> The Vite dev server proxies `/api` calls to `http://localhost:5000`

---

## Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
JWT_SECRET=your_strong_secret_here
PORT=5000
```

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register (role: ADMIN or MEMBER) |
| POST | `/api/auth/login` | ❌ | Login, returns JWT token |

### Projects
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects` | ✅ | List projects (filtered by role) |
| POST | `/api/projects` | Admin | Create project |
| GET | `/api/projects/:id` | ✅ | Project details + tasks + members |
| POST | `/api/projects/:id/members` | Admin | Add members |
| DELETE | `/api/projects/:id/members/:userId` | Admin | Remove member |

### Tasks
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/tasks` | ✅ | Create task |
| PUT | `/api/tasks/:id` | ✅ | Update task (status, assignee, etc.) |
| DELETE | `/api/tasks/:id` | ✅ | Delete task (Admin or Creator) |
| GET | `/api/tasks/my-tasks` | ✅ | Get my assigned tasks |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard` | ✅ | Summary stats (status counts, overdue) |

---

## Deploying to Vercel + Neon

### 1. Create a Neon database
1. Go to [neon.tech](https://neon.tech) → sign up free
2. Create a new project → copy the **connection string**
3. It looks like: `postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require`

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import `chennayaswanth/team-task-manager` from GitHub
3. **Root Directory** → leave as `/` (root)
4. Under **Environment Variables**, add:
   - `DATABASE_URL` → your Neon connection string
   - `JWT_SECRET` → any strong random string
5. Click **Deploy**

Vercel auto-runs the build command from `vercel.json`:
- Builds the React frontend
- Generates Prisma client
- Runs database migrations
- Starts the serverless API

---

## License
MIT
