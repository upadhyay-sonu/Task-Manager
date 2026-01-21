# 🔑 Environment Variables Setup

## Backend .env Configuration

The backend `.env` file has been created at:
```
c:\Users\Sonuu\Desktop\task management\backend\.env
```

### Current Content:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_management"
JWT_ACCESS_SECRET="your-super-secret-access-token-key-change-this-to-random-string-min-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-key-change-this-to-random-string-min-32-chars"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3001"
```

## ⚠️ IMPORTANT: Update DATABASE_URL

The `DATABASE_URL` must match your PostgreSQL password:

### If you set password as "postgres":
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_management"
```
✅ (This is the current default - use this if you're unsure)

### If you set a different password:
Replace the second `postgres` with your actual password:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/task_management"
```

Example if your password is "mypassword123":
```env
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/task_management"
```

## 🔐 JWT Secrets

The JWT secrets are currently placeholders. For production, replace them with strong random strings:

### Generate Strong Secrets (Windows PowerShell)

```powershell
# Generate a random 64-character string
$secret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
Write-Host $secret
```

Copy the output and use for `JWT_ACCESS_SECRET`

Repeat for `JWT_REFRESH_SECRET`

### Or use online tools:
https://www.random.org/passwords/

Generate password with:
- Length: 64
- Uppercase: Yes
- Lowercase: Yes
- Digits: Yes
- Symbols: Optional

---

## Frontend .env.local Configuration

The frontend `.env.local` file has been created at:
```
c:\Users\Sonuu\Desktop\task management\frontend\.env.local
```

### Current Content:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### For Local Development:
Keep as-is (backend runs on localhost:3000)

### For Remote Backend:
If backend runs on a different server, update to:
```env
NEXT_PUBLIC_API_URL=http://YOUR_SERVER_IP:3000
```

Example:
```env
NEXT_PUBLIC_API_URL=http://192.168.1.100:3000
```

---

## ✅ Checklist: Environment Setup

- [ ] `backend/.env` exists
- [ ] DATABASE_URL is correct (matches your PostgreSQL password)
- [ ] JWT_ACCESS_SECRET is set (can be placeholder for dev)
- [ ] JWT_REFRESH_SECRET is set (can be placeholder for dev)
- [ ] `frontend/.env.local` exists
- [ ] NEXT_PUBLIC_API_URL points to backend

---

## 🧪 Verify Setup

### Test Backend Connection

```bash
cd backend
npm run dev
```

You should see:
```
Server running on http://localhost:3000 in development mode
```

If you see an error like:
```
Error: Missing required environment variable: DATABASE_URL
```

Then `.env` file is not being read. Try:
1. Restart your terminal
2. Delete and recreate `.env` file
3. Verify file is in `backend/` directory (not `backend/src/`)

---

## 🚨 Common Issues

### Issue: "password authentication failed"

**Cause:** DATABASE_URL password doesn't match PostgreSQL password

**Solution:**
1. Find your PostgreSQL password (what you entered during installation)
2. Edit `backend/.env`
3. Update DATABASE_URL with correct password
4. Restart backend

### Issue: "database task_management does not exist"

**Cause:** Database hasn't been created yet

**Solution:**
```bash
psql -U postgres -c "CREATE DATABASE task_management;"
```

### Issue: "env is not defined" or env is empty

**Cause:** Environment variables not loaded

**Solution:**
1. Verify `backend/.env` file exists
2. Verify `dotenv` is imported: `import dotenv from "dotenv";`
3. Import dotenv BEFORE accessing env variables
4. Check that .env is in the right directory

---

## 📝 Example Correct Setup

**backend/.env:**
```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/task_management"
JWT_ACCESS_SECRET="aB1cD2eF3gH4iJ5kL6mN7oPqRsTuVwXyZaBcDeFgHiJkLmNoPqRsTuVwXyZ"
JWT_REFRESH_SECRET="zY9xW8vU7tS6rQ5pO4nM3lK2jI1hG0fE9dC8bA7z6y5x4w3v2u1t0s"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3001"
```

**frontend/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🔒 Production Setup

For production, replace:

1. **DATABASE_URL**: Use production PostgreSQL connection
   ```env
   DATABASE_URL="postgresql://produser:strongpassword@prod-db.example.com:5432/task_management"
   ```

2. **JWT Secrets**: Use strong random secrets
   ```env
   JWT_ACCESS_SECRET="[generate using above method]"
   JWT_REFRESH_SECRET="[generate using above method]"
   ```

3. **NODE_ENV**: Change to production
   ```env
   NODE_ENV="production"
   ```

4. **FRONTEND_URL**: Use production frontend URL
   ```env
   FRONTEND_URL="https://app.example.com"
   ```

5. **Next.js NEXT_PUBLIC_API_URL**: Use production backend
   ```env
   NEXT_PUBLIC_API_URL=https://api.example.com
   ```

---

## 📚 Environment Variables Reference

| Variable | Purpose | Example | Required |
|----------|---------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host/db` | ✅ Yes |
| `JWT_ACCESS_SECRET` | Sign access tokens | Random 32+ char string | ✅ Yes |
| `JWT_REFRESH_SECRET` | Sign refresh tokens | Random 32+ char string | ✅ Yes |
| `JWT_ACCESS_EXPIRY` | Access token lifetime | `15m` | ✅ Yes |
| `JWT_REFRESH_EXPIRY` | Refresh token lifetime | `7d` | ✅ Yes |
| `PORT` | Backend server port | `3000` | ⚠️ Optional (default: 3000) |
| `NODE_ENV` | Runtime environment | `development` or `production` | ⚠️ Optional (default: development) |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:3001` | ⚠️ Optional |
| `NEXT_PUBLIC_API_URL` | Backend API URL (frontend) | `http://localhost:3000` | ✅ Yes |

---

**That's it! Environment setup is complete.** ✅

Next step: Run database setup from `QUICK_DATABASE_SETUP.md`
