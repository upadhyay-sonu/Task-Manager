# Final Deployment Checklist ✅

## Pre-Deployment (Do This First)

### Code Quality
- [ ] Run `npm run build` in backend - no TypeScript errors
- [ ] Run `npm run build` in frontend - no TypeScript errors
- [ ] Delete any `console.log()` statements (debug logs can stay)
- [ ] No commented-out code
- [ ] Git history is clean (`git log`)

### Backend Setup
- [ ] `.env` file created with all required variables:
  ```
  DATABASE_URL=postgresql://user:pass@host/dbname
  JWT_ACCESS_SECRET=<32+ char random string>
  JWT_REFRESH_SECRET=<32+ char random string>
  JWT_ACCESS_EXPIRY=15m
  JWT_REFRESH_EXPIRY=7d
  NODE_ENV=production
  FRONTEND_URL=https://your-frontend-domain.com
  PORT=10000
  ```
- [ ] `.env` is in `.gitignore` (verify with `git check-ignore .env`)
- [ ] `.env.example` exists with placeholder values
- [ ] Database migrations created and tested locally
- [ ] `npm install` runs without warnings
- [ ] `npm run build` produces `/dist` folder

### Frontend Setup
- [ ] `.env.local` file created (NOT committed):
  ```
  NEXT_PUBLIC_API_URL=https://your-backend-url.com
  ```
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.example` exists with `NEXT_PUBLIC_API_URL=http://localhost:3000`
- [ ] No hardcoded localhost URLs
- [ ] `npm install` runs without warnings
- [ ] `npm run build` produces `.next` folder

### Environment Variables Review
- [ ] All secret keys are 32+ characters (generated with crypto)
- [ ] No secrets in code (all in `.env`)
- [ ] No secrets in `.env.example`
- [ ] Database URL is correct
- [ ] Frontend URL matches actual domain
- [ ] All environment vars used in code

---

## Backend Deployment (Render)

### Database First
- [ ] Create PostgreSQL database on Render/PlanetScale/Railway/Neon
- [ ] Note the connection string
- [ ] Test connection locally: `psql "connection_string"`
- [ ] Connection string has correct format: `postgresql://user:pass@host:5432/db`

### Render Service Creation
- [ ] Go to render.com dashboard
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository (backend folder)
- [ ] Set service name: `task-management-api`
- [ ] Select region closest to you
- [ ] Set environment: `Node`

### Build Configuration
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Node Version: `18` (or latest)

### Environment Variables in Render
Add these in dashboard:
```
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=<generated value>
JWT_REFRESH_SECRET=<generated value>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
PORT=10000
```

### First Deployment
- [ ] Click "Deploy"
- [ ] Wait for build to complete (5-10 minutes)
- [ ] Check logs for errors: "Logs" tab
- [ ] Note the service URL: `https://task-api-xxxxx.onrender.com`
- [ ] Test health endpoint: `curl https://task-api-xxxxx.onrender.com/health`

### Database Initialization
- [ ] From local machine, run:
  ```bash
  DATABASE_URL="production_url" npx prisma migrate deploy
  ```
- [ ] Or: Go to your database provider and run migrations
- [ ] Verify tables exist: Check with database client

---

## Frontend Deployment (Vercel)

### Project Setup
- [ ] Go to vercel.com
- [ ] Click "Add New..." → "Project"
- [ ] Import GitHub repository (frontend folder)
- [ ] Select "Next.js" framework (auto-detected)

### Build Configuration
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`

### Environment Variables in Vercel
Add in "Settings" → "Environment Variables":
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

### Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Check logs for errors
- [ ] Note the deployment URL: `https://your-project.vercel.app`

---

## Post-Deployment Verification

### Backend Tests
- [ ] Health check: `curl https://api-url.com/health`
  - Should return: `{"status":"OK"}`
- [ ] Register test:
  ```bash
  curl -X POST https://api-url.com/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123","name":"Test"}'
  ```
  - Should return 201 with user data and accessToken

- [ ] Login test:
  ```bash
  curl -X POST https://api-url.com/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123"}'
  ```
  - Should return 200 with accessToken

### Frontend Tests
- [ ] Visit frontend URL in browser
- [ ] No 404 or blank page
- [ ] Redirects to login (good!)
- [ ] Can type in email/password fields
- [ ] Can click register button
- [ ] Register works → redirects to tasks page
- [ ] Create task works
- [ ] Edit task works
- [ ] Delete task works
- [ ] Toggle task works
- [ ] Search works
- [ ] Filter works
- [ ] Pagination works
- [ ] Logout works

### Integration Tests
- [ ] Open browser DevTools → Console
  - No red errors
  - No "cannot fetch" errors
- [ ] Open DevTools → Network tab
  - API requests show 200/201 status
  - No CORS errors
  - Tokens are being sent (Authorization header)
- [ ] Test on mobile (DevTools mobile mode)
  - Layout responsive
  - Touch buttons work
  - Modal displays correctly

### Error Scenarios
- [ ] Register with existing email → error toast
- [ ] Login with wrong password → error toast
- [ ] Create task without title → validation error
- [ ] Logout → can't access tasks
- [ ] Logout → can login again

---

## Domain & DNS (If Using Custom Domain)

### For Backend (if not using Render's domain)
- [ ] Add custom domain in Render settings
- [ ] Update FRONTEND_URL in backend env vars
- [ ] DNS records point to Render
- [ ] HTTPS certificate auto-provisioned

### For Frontend (if not using Vercel's domain)
- [ ] Add custom domain in Vercel settings
- [ ] Update NEXT_PUBLIC_API_URL if domain changed
- [ ] DNS records point to Vercel
- [ ] Redeploy frontend if env vars changed

### Update Backend
- [ ] Set `FRONTEND_URL` to your actual frontend domain
- [ ] This fixes CORS issues

---

## Production Monitoring

### Set Up Logging
- [ ] Enable error logging in deployment dashboard
- [ ] Configure email alerts for errors (optional)
- [ ] Check logs weekly

### Monitor Endpoints
- [ ] Set up uptime monitoring (optional)
  - https://uptimerobot.com (free)
  - Point to `/health` endpoint

### Performance Checks
- [ ] Run Lighthouse audit on frontend
- [ ] Check API response times
- [ ] Monitor database connections

---

## Backup & Recovery

### Database Backup
- [ ] Enable automated backups on database provider
- [ ] Test restore procedure
- [ ] Document backup location

### Code Backup
- [ ] Code is on GitHub (it is!)
- [ ] All environment variables documented
- [ ] `.env` files are local-only (not in git)

---

## Security Final Check

### Secrets
- [ ] No secrets in `.env.example`
- [ ] No secrets in code
- [ ] All secrets in deployment dashboard
- [ ] JWT secrets are 32+ characters
- [ ] Secrets are unique per environment

### CORS
- [ ] CORS allows only frontend domain
- [ ] No `origin: *` in production
- [ ] Backend rejects unknown origins

### Passwords
- [ ] Passwords hashed with bcryptjs
- [ ] No password in logs
- [ ] Password minimum 6 chars enforced

### Tokens
- [ ] Access tokens expire in 15 minutes
- [ ] Refresh tokens expire in 7 days
- [ ] Tokens can't be reused after logout
- [ ] Tokens stored securely (HTTP-only cookies)

---

## Performance Optimization

### Backend
- [ ] Database queries are indexed (check Prisma schema)
- [ ] No N+1 queries
- [ ] Pagination enforced (max 100 items)
- [ ] Error handling doesn't leak internals

### Frontend
- [ ] No console warnings
- [ ] Images optimized (if used)
- [ ] Lazy loading components
- [ ] API calls debounced (search)

---

## Documentation

### For Your Team
- [ ] README.md updated with setup instructions
- [ ] API.md documents all endpoints
- [ ] DEPLOYMENT_GUIDE.md explains deployment
- [ ] Environment variables documented

### For Future You
- [ ] How to add new features
- [ ] How to deploy updates
- [ ] How to debug production issues
- [ ] How to reset database (if needed)

---

## Final Checks

### Code Quality
- [ ] No `console.log()` statements (except errors)
- [ ] No `TODO` comments without context
- [ ] Code follows existing style
- [ ] No unused imports
- [ ] All TypeScript types correct

### Functionality
- [ ] All features work locally
- [ ] All features work in production
- [ ] No broken links
- [ ] No dead code paths

### User Experience
- [ ] App is fast (< 3s load)
- [ ] Toast notifications work
- [ ] Error messages are helpful
- [ ] Empty states shown
- [ ] Loading states visible

---

## GO LIVE CHECKLIST

### Before Click Deploy
- [ ] Environment variables in deployment dashboard? ✅
- [ ] Database created and connected? ✅
- [ ] Code pushed to GitHub main branch? ✅
- [ ] `.env` NOT in git? ✅
- [ ] Build succeeds locally? ✅
- [ ] Tests pass? ✅
- [ ] Team notified? ✅

### After Click Deploy
- [ ] Monitor logs for errors
- [ ] Test basic workflow
- [ ] Get feedback from first users
- [ ] Fix any production issues immediately

---

## Post-Launch (Next 24 Hours)

- [ ] Monitor error logs
- [ ] Check user feedback
- [ ] Performance metrics look good?
- [ ] No 500 errors?
- [ ] Database is healthy?
- [ ] Respond to any issues
- [ ] Document any fixes
- [ ] Plan next features

---

## Success Criteria

✅ App is live at stable URL
✅ Users can register and login
✅ Users can create/edit/delete tasks
✅ No errors in production logs
✅ Load time < 3 seconds
✅ No CORS issues
✅ Database connected and working
✅ Session persists across reloads
✅ Logout works correctly
✅ Task isolation enforced (users see only their tasks)

**Status: READY TO DEPLOY**

---

## Important Numbers to Save

```
Backend Service URL: https://task-api-xxxxx.onrender.com
Frontend App URL: https://task-app-xxxxx.vercel.app
Database Provider: [Render/PlanetScale/Railway/etc]
Database URL: postgresql://...
JWT_ACCESS_SECRET: [keep secret]
JWT_REFRESH_SECRET: [keep secret]
```

Save these in a secure location (password manager, notes)!

---

## Emergency Contacts

In case of production issues:

1. **Check Logs:** Render/Vercel dashboard → Logs
2. **Rollback:** Redeploy previous version from GitHub
3. **Database Down:** Check database provider dashboard
4. **CORS Issues:** Verify FRONTEND_URL in backend env vars
5. **Token Issues:** Check JWT secrets in env vars

---

## Celebrate! 🎉

Your Task Management app is now production-ready and deployed!

Next steps:
- Share with team
- Get user feedback
- Plan new features
- Maintain and monitor
