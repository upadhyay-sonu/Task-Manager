# ⚡ Quick Database Setup (Copy-Paste Commands)

## 🚀 One-Time Setup (5 minutes)

### 1. Open Command Prompt (as Administrator)

Press `Win+R` and type:
```
cmd
```

Right-click and select "Run as administrator"

### 2. Create Database

Copy and paste this:

```bash
psql -U postgres -c "CREATE DATABASE task_management;"
```

When prompted, enter your PostgreSQL password (usually "postgres").

You should see: `CREATE DATABASE`

### 3. Run Migrations

In the same Command Prompt, navigate to backend:

```bash
cd "C:\Users\Sonuu\Desktop\task management\backend"
npm run prisma:migrate
```

When asked for migration name, type: `init` and press Enter

You should see: `✓ Generated Prisma Client ... and created n database tables`

### 4. Start Backend

```bash
npm run dev
```

You should see: `Server running on http://localhost:3000`

### 5. Open New Command Prompt for Frontend

```bash
cd "C:\Users\Sonuu\Desktop\task management\frontend"
npm run dev
```

You should see: `✓ Ready in X.Xs`

### 6. Open Browser

Navigate to: http://localhost:3001

**Register a test account and you're done!** ✅

---

## 🆘 If Something Fails

### Database already exists error?
Run this instead:
```bash
psql -U postgres -c "DROP DATABASE IF EXISTS task_management; CREATE DATABASE task_management;"
```

### Password authentication failed?
Try with localhost:
```bash
psql -U postgres -h localhost -c "CREATE DATABASE task_management;"
```

### PostgreSQL not running?
Open Services (Win+R → services.msc) and start PostgreSQL

### Connection refused error?
Make sure PostgreSQL is running (see above)

---

## ✅ Quick Verification

After running migrations, verify tables exist:

```bash
psql -U postgres -d task_management -c "\dt"
```

You should see:
```
 List of relations
 Schema |     Name      | Type  | Owner
--------+---------------+-------+----------
 public | users         | table | postgres
 public | refresh_tokens| table | postgres
 public | tasks         | table | postgres
(3 rows)
```

If you see this, you're good to go! ✅

---

## 📝 Notes

- **Default PostgreSQL user**: `postgres`
- **Default PostgreSQL password**: usually `postgres` (or whatever you set during installation)
- **Database name**: `task_management`
- **Backend port**: 3000
- **Frontend port**: 3001

That's it! No other setup needed.
