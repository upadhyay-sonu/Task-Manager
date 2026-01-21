# Complete Setup Guide - Task Management Application

This guide will help you set up and run the complete Task Management application locally.

## ✅ Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download/))
- **Git** (optional, for version control)

Verify installations:
```bash
node --version   # Should be v18.0.0 or higher
npm --version    # Should be 9.0.0 or higher
psql --version   # PostgreSQL version
```

## 🗄️ Step 1: Database Setup

### Option A: PostgreSQL Installation (Windows)

1. Download and install PostgreSQL from https://www.postgresql.org/download/windows/
2. During installation:
   - Set password for `postgres` user (remember this!)
   - Keep default port 5432
   - Install pgAdmin 4 (optional, for GUI management)

3. Verify PostgreSQL is running:
   ```bash
   psql -U postgres
   ```
   Enter your password when prompted. If successful, you'll see the `postgres=#` prompt.

### Option B: Using Existing PostgreSQL

If PostgreSQL is already installed, proceed to create the database.

### Create Database

1. Connect to PostgreSQL:
   ```bash
   psql -U postgres
   ```

2. Create database and user:
   ```sql
   -- Create database
   CREATE DATABASE task_management;

   -- Create user
   CREATE USER taskuser WITH PASSWORD 'your_secure_password_here';

   -- Grant privileges
   ALTER ROLE taskuser WITH CREATEDB;
   GRANT ALL PRIVILEGES ON DATABASE task_management TO taskuser;

   -- Exit
   \q
   ```

## 🔙 Step 2: Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Environment File
```bash
# Copy the example file
copy .env.example .env

# Or manually create .env file with:
```

Edit `backend/.env` and set:
```env
# Database Connection
DATABASE_URL="postgresql://taskuser:your_secure_password_here@localhost:5432/task_management"

# JWT Secrets (use strong random strings)
JWT_ACCESS_SECRET="your-super-secret-access-token-key-change-me-to-something-random-and-long-at-least-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-key-change-me-to-something-random-and-long-at-least-32-chars"

# Token Expiry
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# Server Configuration
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3001"
```

**Important**: Generate secure secrets. On Windows PowerShell:
```powershell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..64 | ForEach-Object {[char](Get-Random -Minimum 33 -Maximum 127))} -join ''))) | Select -First 1
```

Or use online tools like https://www.random.org/strings/

### 3. Install Dependencies
```bash
npm install
```

### 4. Initialize Database
```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate
```

When prompted for migration name, enter: `init`

This creates all necessary tables in the database.

### 5. Verify Installation
```bash
# Check if database was set up correctly
npx prisma studio
```

This opens a web UI to view your database at http://localhost:5555

### 6. Start Backend Server
```bash
npm run dev
```

You should see:
```
Server running on http://localhost:3000 in development mode
```

**Test the health endpoint:**
```bash
curl http://localhost:3000/health
# Should return: {"status":"OK"}
```

**Keep this terminal running!** Open a new terminal for the next steps.

## 🎨 Step 3: Frontend Setup

### 1. Navigate to Frontend Directory (in a NEW terminal)
```bash
cd frontend
```

### 2. Create Environment File
```bash
# Copy the example file
copy .env.example .env.local

# Or manually create .env.local with:
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Frontend Server
```bash
npm run dev
```

You should see:
```
  ▲ Next.js 14.1.0
  - Local:        http://localhost:3001
  - Environments: .env.local

 ✓ Ready in 2.5s
```

## 🚀 Step 4: Access the Application

1. Open your browser to **http://localhost:3001**
2. You'll be redirected to the login page
3. Click "Create one" to register a new account
4. Fill in:
   - **Full Name**: Your name
   - **Email**: Your email (any format)
   - **Password**: At least 6 characters
   - **Confirm Password**: Must match

5. After registration, you'll be logged in and can:
   - ✅ Create tasks
   - ✅ Edit tasks
   - ✅ Mark tasks as complete
   - ✅ Delete tasks
   - ✅ Search and filter tasks
   - ✅ View paginated results

## 📊 Verify Everything Works

### Backend Tests
```bash
# In backend directory

# 1. Test health check
curl http://localhost:3000/health

# 2. Register a test user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# 3. Login (copy the accessToken from response)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 4. Get tasks (replace TOKEN with accessToken from login)
curl http://localhost:3000/tasks \
  -H "Authorization: Bearer TOKEN"
```

### Frontend Tests
- Register a new account
- Create a task
- Edit a task
- Mark task as complete
- Delete a task
- Logout and login again
- Verify all features work on mobile viewport (F12 → Toggle device toolbar)

## 🛠️ Common Issues & Solutions

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Find and kill process using port 3000
# On Windows (as admin):
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in backend/.env:
PORT=3001
```

### Issue: "Database connection failed"
**Solution:**
1. Verify PostgreSQL is running:
   ```bash
   psql -U postgres
   ```
2. Check DATABASE_URL in `.env` is correct
3. Ensure database `task_management` exists:
   ```bash
   psql -U postgres -l
   ```

### Issue: "Cannot find module 'jsonwebtoken'"
**Solution:**
```bash
# In backend directory
npm install --legacy-peer-deps
rm -rf node_modules package-lock.json
npm install
```

### Issue: "CORS Error" in frontend
**Solution:**
1. Check FRONTEND_URL in `backend/.env` matches your frontend URL
2. Ensure backend is running on http://localhost:3000
3. Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Prisma Client not found"
**Solution:**
```bash
# In backend directory
npm run prisma:generate
```

### Issue: "Token expired" or "Unauthorized"
**Solution:**
1. Clear browser localStorage:
   - Open DevTools (F12)
   - Go to Application → Local Storage → Clear All
2. Refresh page and login again

## 📁 Project Structure Reference

```
task-management/
├── backend/                    # API Server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Express middleware
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # Helper functions
│   │   └── index.ts            # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # Database migrations
│   ├── node_modules/
│   ├── dist/                   # Compiled output
│   ├── .env                    # Environment variables (create from .env.example)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Next.js Application
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── login/          # Login page
│   │   │   ├── register/       # Registration page
│   │   │   ├── tasks/          # Dashboard
│   │   │   ├── layout.tsx      # Root layout
│   │   │   └── page.tsx        # Home redirect
│   │   ├── components/         # Reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskModal.tsx
│   │   │   └── Toast.tsx
│   │   ├── lib/
│   │   │   └── api.ts          # API client
│   │   ├── store/
│   │   │   ├── auth.ts         # Auth state
│   │   │   └── tasks.ts        # Tasks state
│   │   ├── styles/
│   │   │   └── globals.css     # Global styles
│   │   └── types/
│   │       └── index.ts        # TypeScript types
│   ├── node_modules/
│   ├── .next/                  # Build output
│   ├── .env.local              # Environment variables (create from .env.example)
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── postcss.config.js
│
├── node_modules/
├── .gitignore
├── README.md                   # Full documentation
├── SETUP_GUIDE.md              # This file
└── SETUP_GUIDE.md
```

## 🔐 Security Notes

1. **Environment Variables**: Never commit `.env` files to git
2. **JWT Secrets**: Use strong, random secrets in production
3. **Passwords**: Stored as bcrypt hashes, never plain text
4. **Refresh Tokens**: Stored in HTTP-only cookies for security
5. **CORS**: Configure only for trusted domains
6. **HTTPS**: Always use HTTPS in production

## 📚 Useful Commands

### Backend
```bash
cd backend

# Development
npm run dev              # Start development server
npm run build            # Compile TypeScript
npm start               # Run compiled code

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open database UI
```

### Frontend
```bash
cd frontend

npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Run linter
```

## 🌐 API Documentation

All API endpoints require JWT authentication (except auth endpoints).

### Auth Endpoints
```
POST /auth/register      # Register new user
POST /auth/login         # Login user
POST /auth/refresh       # Refresh access token
POST /auth/logout        # Logout user
```

### Task Endpoints (Protected)
```
GET    /tasks                  # List user's tasks
POST   /tasks                  # Create new task
GET    /tasks/:id              # Get specific task
PATCH  /tasks/:id              # Update task
PATCH  /tasks/:id/toggle       # Toggle task status
DELETE /tasks/:id              # Delete task
```

### Query Parameters
```
GET /tasks?page=1&limit=10&status=PENDING&search=meeting
```

## 📱 Testing on Mobile

To test the application on your phone:

1. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig | findstr "IPv4"
   
   # Linux/Mac
   ifconfig | grep inet
   ```

2. Update frontend `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://YOUR_IP:3000
   ```

3. Access from phone: `http://YOUR_IP:3001`

## ✨ Next Steps

1. **Test the application** with multiple users
2. **Customize colors** in `frontend/tailwind.config.ts`
3. **Add more fields** to tasks in `backend/prisma/schema.prisma`
4. **Deploy** to production using:
   - Backend: Heroku, Railway, Vercel API Routes
   - Frontend: Vercel, Netlify, Cloudflare Pages

## 📞 Support

If you encounter issues:
1. Check error messages carefully
2. Review the respective `.env` files
3. Ensure all services are running
4. Check browser console (F12) for frontend errors
5. Check terminal for backend errors

---

**Congratulations!** Your Task Management application is now set up and ready to use. 🎉
