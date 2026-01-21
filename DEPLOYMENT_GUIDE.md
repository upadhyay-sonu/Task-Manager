# Deployment Guide - Task Management App

## 📋 Pre-Deployment Checklist

### Backend Preparation
- [ ] Environment variables configured in `.env`
- [ ] Database migrations run: `npm run prisma:migrate`
- [ ] All dependencies installed: `npm install`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors

### Frontend Preparation
- [ ] Environment variables in `.env.local` (not committed)
- [ ] All dependencies installed: `npm install`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] `NEXT_PUBLIC_API_URL` points to backend domain

---

## 🚀 Deploy to Render (Backend)

### Step 1: Prepare Backend Repository
```bash
cd backend
npm install
npm run build
```

### Step 2: Create PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Set database name, user, password
4. Copy connection string (will be like `postgresql://...`)

### Step 3: Deploy Node.js Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Set configuration:
   - **Name:** task-management-api
   - **Region:** Choose closest to you
   - **Branch:** main (or your deploy branch)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

### Step 4: Add Environment Variables
In Render dashboard, add these to your service:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_ACCESS_SECRET=your-secret-32-chars-min-random-string
JWT_REFRESH_SECRET=your-secret-32-chars-min-random-string
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
PORT=10000
```

**Generate secure secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Deploy
- Click "Deploy" button
- Wait for build to complete
- Note the service URL (e.g., `https://task-api-xxx.onrender.com`)

---

## 🎯 Deploy to Vercel (Frontend)

### Step 1: Build Frontend Locally
```bash
cd frontend
npm install
npm run build
```

### Step 2: Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository (frontend folder)

### Step 3: Configure Build Settings
- **Framework:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Step 4: Add Environment Variables
In Vercel project settings, add:
```
NEXT_PUBLIC_API_URL=https://task-api-xxx.onrender.com
```

**Important:** This MUST start with `NEXT_PUBLIC_` to be available in browser.

### Step 5: Deploy
- Click "Deploy"
- Wait for deployment to complete
- Your app is now live at `https://your-project.vercel.app`

---

## ✅ Post-Deployment

### 1. Verify Backend
```bash
curl https://task-api-xxx.onrender.com/health
# Should return: {"status":"OK"}
```

### 2. Test Authentication
```bash
# Register
curl -X POST https://task-api-xxx.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Should return user object with accessToken
```

### 3. Test from Frontend
- Go to your Vercel URL
- Register a new account
- Create, edit, delete tasks
- Logout and login again

### 4. Monitor Logs
- **Render:** View logs in dashboard under "Logs"
- **Vercel:** View logs in "Functions" tab

---

## 🔒 Security Checklist

- ✅ Never commit `.env` files
- ✅ Secrets stored in deployment platform
- ✅ HTTPS enabled (automatic on Render & Vercel)
- ✅ CORS configured for frontend domain
- ✅ Refresh tokens stored HTTP-only
- ✅ Access tokens short-lived (15 minutes)
- ✅ Passwords hashed with bcryptjs
- ✅ User isolation enforced (can't access others' tasks)

---

## 🐛 Troubleshooting

### Backend Won't Start
**Error:** "Missing required environment variable"
- Check all required vars in `.env`
- Render dashboard → Service → Environment

### Frontend Shows "Cannot connect to API"
**Error:** Network error when fetching tasks
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS configuration on backend
- Rebuild and redeploy frontend

### Database Connection Failed
**Error:** "connect ECONNREFUSED"
- Verify `DATABASE_URL` is correct
- Database must be running
- Check firewall/network settings

### Tokens Always Invalid
**Error:** "Invalid or expired token"
- Verify `JWT_ACCESS_SECRET` is same on all instances
- Check clock synchronization on servers

---

## 📊 Environment Variables Reference

### Backend (.env)
| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host/db` |
| `JWT_ACCESS_SECRET` | Sign access tokens | Random 32+ char string |
| `JWT_REFRESH_SECRET` | Sign refresh tokens | Random 32+ char string |
| `JWT_ACCESS_EXPIRY` | Access token lifetime | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token lifetime | `7d` |
| `NODE_ENV` | Environment | `production` or `development` |
| `FRONTEND_URL` | Frontend domain for CORS | `https://app.example.com` |
| `PORT` | Server port | `10000` or `3000` |

### Frontend (.env.local)
| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.example.com` |

---

## 🔄 Continuous Deployment

Both Render and Vercel support automatic deployment on git push:

1. Push to main branch: `git push origin main`
2. Render automatically triggers backend rebuild
3. Vercel automatically triggers frontend rebuild
4. Your changes are live within minutes

---

## 💾 Database Migrations

When you update Prisma schema:

### Local Development
```bash
npx prisma migrate dev --name your_migration_name
```

### Production
```bash
# Run migrations during deployment
npx prisma migrate deploy
```

Render can run this automatically with a build command.

---

## 📝 Monitoring

### Logs to Check
- Backend errors: Render dashboard → Logs
- Frontend errors: Vercel dashboard → Functions → Logs
- Database: PostgreSQL provider dashboard

### Key Metrics
- Response times
- Error rates
- Database connection pool usage
- Token refresh success rate

---

## 🆘 Getting Help

1. Check logs in deployment dashboard
2. Verify environment variables are set correctly
3. Test endpoints with curl
4. Review error messages carefully

Common errors:
- "Missing environment variable" → Add to dashboard
- "Cannot connect to database" → Check DATABASE_URL
- "CORS error" → Check FRONTEND_URL matches actual frontend URL
