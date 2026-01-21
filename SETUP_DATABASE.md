# Setup PostgreSQL Database

## Step 1: Install PostgreSQL (if not already installed)

Download from: https://www.postgresql.org/download/windows/

During installation:
- Set password for `postgres` user (e.g., "postgres")
- Keep default port 5432
- Install pgAdmin 4 (optional, for GUI)

## Step 2: Create Database

Open PowerShell or Command Prompt and run:

```bash
psql -U postgres
```

When prompted, enter the password you set during installation.

Then run these SQL commands:

```sql
CREATE DATABASE task_management;
\q
```

## Step 3: Update Backend .env

Edit `backend/.env` and update the DATABASE_URL:

If you used "postgres" as the password:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_management"
```

If you used a different password, replace `postgres` with your password:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/task_management"
```

## Step 4: Run Database Migrations

In the `backend` directory, run:

```bash
npm run prisma:migrate
```

When prompted, name the migration: `init`

## Step 5: Verify Setup

```bash
npx prisma studio
```

This opens a web UI at http://localhost:5555 where you can see your database tables.

---

## Done! ✅

Your database is now ready. You can start the backend:

```bash
npm run dev
```

## Troubleshooting

**Error: "connect ECONNREFUSED 127.0.0.1:5432"**
- PostgreSQL is not running
- Start PostgreSQL service:
  - On Windows: Services → PostgreSQL → Start
  - Or restart your computer

**Error: "password authentication failed"**
- Check your password is correct in DATABASE_URL
- Make sure you're using the `postgres` user

**Error: "database task_management does not exist"**
- Create the database using the SQL command above
- Or check DATABASE_URL is pointing to the right database

---

Once complete, go back and run:
```bash
npm run dev
```
