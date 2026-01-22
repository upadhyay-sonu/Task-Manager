# ⚡ Quick Start - 3 Minutes to Running App

## 🚀 Start Everything (Right Now!)

### Step 1️⃣: Database Already Running ✅
PostgreSQL is running via Docker at `localhost:5432`

**Verify:**
```bash
docker ps
# Should show: postgres-dev running on 0.0.0.0:5432->5432/tcp
```

### Step 2️⃣: Start Backend (Open Terminal 1)
```bash
cd backend
npm run dev
```

**Expected Output:**
```
[INFO] ts-node-dev ver. 2.0.0
Server running on http://localhost:3000 in development mode
```

✅ **Backend is ready!**

### Step 3️⃣: Start Frontend (Open Terminal 2)
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
- Local:        http://localhost:3001
```

✅ **Frontend is ready!**

---

## 🎯 Open in Browser

**Go to:** http://localhost:3001

You'll see the login page.

---

## 📝 Test Registration

1. Click **"Create one"** (create account link)
2. Fill in:
   - **Name:** John Doe
   - **Email:** john@example.com
   - **Password:** password123
   - **Confirm:** password123
3. Click **"Create Account"**
4. You'll see the **task dashboard** ✅

---

## ✅ Test Features

### Create Task
1. Click **"New Task"**
2. Enter title: "Buy groceries"
3. Enter description: "Milk, eggs, bread"
4. Click **"Create"**
5. Task appears in list ✅

### View Task
1. Click on task card
2. Modal shows task details ✅

### Edit Task
1. Click **"Edit"** button
2. Modify title/description
3. Click **"Update"**
4. Changes saved ✅

### Complete Task
1. Click the **circle icon** on task card
2. Status changes to completed ✅

### Delete Task
1. Click **trash icon** on task card
2. Confirmation toast appears
3. Task is deleted ✅

### Search Tasks
1. Type in **search box**
2. Tasks filter by title ✅

### Filter by Status
1. Select **"Pending"** or **"Completed"**
2. List updates ✅

### Logout
1. Click **"Logout"** button
2. Redirected to login page ✅

---

## ✅ Everything Works When:

- [x] Can register new account
- [x] Can login again
- [x] Can create tasks
- [x] Can view tasks
- [x] Can edit tasks
- [x] Can delete tasks
- [x] Can logout
- [x] No errors in console
- [x] No red error messages

---

## 🔥 If Something Breaks

### "Cannot connect to database"
**Fix:**
```bash
docker ps  # Check if postgres-dev is running
docker start postgres-dev  # Start if needed
```

### "Port already in use"
**Fix:**
```bash
# Change backend port in backend/.env
PORT=3001

# OR kill the process using port 3000
# (Windows) netstat -ano | findstr :3000
```

### "Cannot find module"
**Fix:**
```bash
cd backend && npm install
cd frontend && npm install
```

### "CORS error"
**Fix:**
- Make sure backend is running on port 3000
- Check frontend is on port 3001
- Restart both services

---

## 📱 What You Have

### Backend (Express + TypeScript)
- ✅ Authentication (register, login, logout, refresh)
- ✅ Task CRUD (create, read, update, delete, toggle)
- ✅ User isolation (your tasks only)
- ✅ Error handling (comprehensive)
- ✅ Input validation (secure)

### Frontend (Next.js + React)
- ✅ Beautiful dark theme
- ✅ Responsive design (works on phone/tablet/desktop)
- ✅ Smooth animations
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling

### Database (PostgreSQL)
- ✅ Users table (secure passwords)
- ✅ Tasks table (user-isolated)
- ✅ Refresh tokens table (session management)
- ✅ Migrations (auto-applied)
- ✅ Indexes (optimized queries)

---

## 🎓 Key Commands

```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Build for production
cd backend && npm run build
cd frontend && npm run build

# View database (Prisma Studio)
cd backend && npx prisma studio

# Run migrations
cd backend && npx prisma migrate dev

# Check database
docker exec -it postgres-dev psql -U postgres -d task_management -c "\dt"
```

---

## 🚀 Deploy When Ready

See `FINAL_DEPLOYMENT_CHECKLIST.md` for deployment to:
- **Backend:** Render
- **Frontend:** Vercel
- **Database:** PostgreSQL anywhere

---

## ✨ Summary

| Component | Port | Status |
|-----------|------|--------|
| Frontend | 3001 | ✅ Running |
| Backend | 3000 | ✅ Running |
| Database | 5432 | ✅ Running |

**Everything is ready. Go use it!** 🎉

---

## 📞 Questions?

**See full docs:**
- `STARTUP_GUIDE.md` - Detailed startup
- `SYSTEM_STATUS.md` - Complete system report
- `DEPLOYMENT_GUIDE.md` - Deploy to production
- `FINAL_DEPLOYMENT_CHECKLIST.md` - Launch checklist

---

**Status: READY** ✅
**Next: Open http://localhost:3001**
