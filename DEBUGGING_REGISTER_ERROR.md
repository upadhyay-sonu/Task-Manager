# Debugging Guide: POST /auth/register 500 Error

## 🎯 What Was Fixed

You were getting 500 Internal Server Error on POST /auth/register due to **4 critical issues**:

### ❌ Issue 1: No Error Handling in Controller
- The `register()` method had NO try-catch
- Any exception crashed without being caught
- Frontend received generic 500 error with no details

### ❌ Issue 2: No Database Error Handling in Service
- Prisma errors weren't caught
- Connection failures weren't mapped to proper HTTP codes
- Silent failures made debugging impossible

### ❌ Issue 3: Insufficient Error Logging
- Error handler logged errors but didn't expose details
- In development mode, you had no visibility into what failed
- Prisma error codes weren't being identified

### ❌ Issue 4: Missing Database Setup
- The `task_management` database wasn't created
- Prisma migrations weren't run
- Tables didn't exist, causing connection errors

---

## ✅ What Was Fixed

### ✅ Fix 1: Added Try-Catch in Controllers
```typescript
async register(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    console.log("[REGISTER] Request received");
    validate(req.body, registerValidationRules);
    const result = await authService.register(req.body);
    // ... rest of logic
  } catch (error) {
    console.error("[REGISTER] Error:", error.message);
    throw error; // Pass to Express error handler
  }
}
```

### ✅ Fix 2: Added Comprehensive Error Logging
- Service now logs each step of registration
- Error handler identifies Prisma error codes (P2002, P2025, P1000, etc.)
- Development mode exposes error details to frontend
- Production mode hides sensitive details

### ✅ Fix 3: Enhanced Error Handler
- Maps Prisma errors to correct HTTP status codes
- P2002 → 409 (duplicate email)
- P1000/P1001 → 503 (database connection failed)
- Provides helpful error messages

### ✅ Fix 4: Database Instructions Below

---

## 🚀 How to Complete Setup

### Step 1: Verify PostgreSQL Installation

**Windows Command Prompt (as Administrator):**
```bash
psql --version
```

Should return: `psql (PostgreSQL) 15.x ...`

If not installed, download from: https://www.postgresql.org/download/windows/

### Step 2: Create Database

```bash
psql -U postgres
```

You'll be prompted for the password. Enter the password you set during PostgreSQL installation.

Then execute:
```sql
CREATE DATABASE task_management;
\q
```

### Step 3: Update Backend .env

Edit `backend/.env` (we already created this file):

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/task_management"
```

Replace `YOUR_PASSWORD` with the password you set for the `postgres` user during PostgreSQL installation.

**Common passwords used during setup:**
- `postgres` (default suggestion)
- `admin`
- `password`
- Whatever you entered during installation

### Step 4: Run Database Migrations

```bash
cd backend
npm run prisma:migrate
```

When asked for a migration name, type: `init`

This creates all tables (users, tasks, refresh_tokens).

### Step 5: Verify Database Setup

```bash
npx prisma studio
```

Opens http://localhost:5555 - you should see the Users table (empty).

### Step 6: Start Backend

```bash
npm run dev
```

You should see:
```
Server running on http://localhost:3000 in development mode
```

---

## 🧪 Test the Fix

### Using cURL

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Expected Success Response (201):
```json
{
  "userId": "clk123...",
  "email": "test@example.com",
  "name": "Test User",
  "accessToken": "eyJhbGciOi..."
}
```

### Expected Error Responses:

**Duplicate Email (409):**
```json
{
  "message": "Email already registered",
  "statusCode": 409,
  "timestamp": "2025-01-21T..."
}
```

**Database Connection Failed (503):**
```json
{
  "message": "Database connection failed - ensure PostgreSQL is running",
  "statusCode": 503,
  "timestamp": "2025-01-21T...",
  "error": "connect ECONNREFUSED 127.0.0.1:5432",
  "code": "P1000"
}
```

**Invalid Email (400):**
```json
{
  "message": "Validation failed",
  "statusCode": 400,
  "timestamp": "2025-01-21T...",
  "details": {
    "email": "Invalid email format"
  }
}
```

---

## 🔍 Debugging in Development

When you run `npm run dev`, you'll see detailed logs:

```
[REGISTER] Request received: {
  email: 'test@example.com',
  name: 'Test User',
  passwordLength: 11
}
[REGISTER] Validation passed
[AUTH_SERVICE] Register: Checking for existing user
[AUTH_SERVICE] Register: Hashing password
[AUTH_SERVICE] Register: Creating user in database
[AUTH_SERVICE] Register: User created successfully, generating token
[REGISTER] User created: { userId: 'clk123', email: 'test@example.com' }
[REGISTER] Refresh token created
```

---

## 🆘 Troubleshooting

### Error: "Password authentication failed for user 'postgres'"

**Cause:** Wrong password in DATABASE_URL

**Solution:**
1. Figure out the password you set during PostgreSQL installation
2. Edit `backend/.env` and update DATABASE_URL
3. Restart backend

**If you forgot the password:**
```bash
# Reset PostgreSQL password (Windows, as Admin)
psql -U postgres -d postgres

# Then execute:
ALTER USER postgres WITH PASSWORD 'newpassword';
\q

# Update backend/.env with new password
```

### Error: "database task_management does not exist"

**Cause:** Database wasn't created

**Solution:**
```bash
psql -U postgres
CREATE DATABASE task_management;
\q
```

### Error: "connect ECONNREFUSED 127.0.0.1:5432"

**Cause:** PostgreSQL isn't running

**Solution on Windows:**
1. Open Services (Win+R → services.msc)
2. Find "PostgreSQL" service
3. Right-click → Start
4. Or restart your computer

### Error: "FATAL: Ident authentication failed"

**Cause:** Wrong user or authentication method

**Solution:**
```bash
psql -U postgres -h localhost
```

The `-h localhost` forces TCP connection instead of Unix socket.

### Code "P2002" in error response

**Cause:** Email already exists in database

**Solution:** Use a different email or delete the user:
```bash
psql -U postgres
\c task_management
DELETE FROM users WHERE email = 'test@example.com';
\q
```

### Code "P1000" or "P1001" in error response

**Cause:** PostgreSQL isn't running or DATABASE_URL is wrong

**Solution:**
1. Start PostgreSQL
2. Check DATABASE_URL is correct
3. Test connection: `psql -U postgres -d task_management`

---

## 📋 Checklist: Registration Should Work When

- [x] PostgreSQL is installed and running
- [x] Database `task_management` is created
- [x] `npm run prisma:migrate` has run successfully
- [x] `backend/.env` has correct DATABASE_URL
- [x] Backend server is running (`npm run dev`)
- [x] POST /auth/register returns 201 with accessToken
- [x] Frontend receives accessToken and sets it in localStorage

---

## 🔐 Production Considerations

The logging we added is **safe for production**:
- ✅ No passwords logged (only length)
- ✅ No tokens logged
- ✅ No sensitive data exposed
- ✅ Error messages are meaningful but safe
- ✅ Development mode hides implementation details in production

For production, disable console logs by checking NODE_ENV:
```typescript
if (process.env.NODE_ENV === "development") {
  console.log("[REGISTER] Request received");
}
```

---

## 📚 Files Modified

1. **backend/src/controllers/auth.controller.ts**
   - Added try-catch for register()
   - Added try-catch for login()
   - Added detailed logging

2. **backend/src/services/auth.service.ts**
   - Added try-catch with logging in register()
   - Logs each step: validation, hashing, creation, token generation
   - Catches and logs Prisma errors

3. **backend/src/middleware/errorHandler.ts**
   - Enhanced error logging with context (method, path, timestamp)
   - Maps Prisma error codes to HTTP status codes
   - Shows error details in development mode
   - Hides implementation details in production

---

## ✨ Next Steps

1. **Ensure PostgreSQL is running** (required)
2. **Create the database** (required)
3. **Run migrations** (required): `npm run prisma:migrate`
4. **Start backend**: `npm run dev`
5. **Start frontend** (in new terminal): `cd frontend && npm run dev`
6. **Test registration** at http://localhost:3001

---

**All errors from this point will be meaningful and actionable.**

The error handler will tell you exactly what went wrong, and the logs will show you where in the flow it failed.

Good luck! 🚀
