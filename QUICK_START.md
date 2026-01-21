# Quick Start - 5 Minutes

## Prerequisites
- Node.js 18+ installed
- PostgreSQL running locally
- Database `task_management` created

## Backend (Terminal 1)

```bash
cd backend

# Create .env file
copy .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://taskuser:password@localhost:5432/task_management"
# JWT_ACCESS_SECRET="your-32-char-secret"
# JWT_REFRESH_SECRET="your-32-char-secret"

# Install & Setup
npm install
npm run prisma:migrate
npm run dev

# Server runs on http://localhost:3000
```

## Frontend (Terminal 2)

```bash
cd frontend

# Create .env.local
copy .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3000

# Install & Start
npm install
npm run dev

# App runs on http://localhost:3001
```

## Done! 🎉

1. Open http://localhost:3001
2. Register new account
3. Create, edit, delete tasks
4. Log out and log back in
5. All features work!

---

For detailed setup, see `SETUP_GUIDE.md`
