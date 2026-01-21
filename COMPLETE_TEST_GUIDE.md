# ✅ Complete Testing Guide - Full App Verification

After applying all fixes (Task Loading + Toast Deduplication), follow this comprehensive testing guide.

---

## 🚀 Setup (Before Testing)

### 1. Ensure PostgreSQL is Running
```bash
# Windows Services or Docker
# Verify at: http://localhost:3000/health
```

### 2. Start Backend
```bash
cd backend
npm run dev
# Should show: Server running on http://localhost:3000 in development mode
```

### 3. Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
# Should show: ✓ Ready in X.Xs
# Open: http://localhost:3001
```

---

## 📋 Test Suite 1: Authentication Flow

### ✅ Test 1.1: User Registration
**Objective**: Verify registration works without errors

1. Go to http://localhost:3001
2. Click "Create one" link (or navigate to `/register`)
3. Fill form:
   - Email: `test1@example.com`
   - Name: `Test User`
   - Password: `password123`
4. Click "Sign Up"

**Expected Result**:
- ✅ No validation errors
- ✅ No toast errors
- ✅ Redirected to `/tasks` page
- ✅ Welcome message shows "Test User"
- ✅ Backend logs show successful user creation

**Backend Check**:
```
[AUTH_SERVICE] Register: User created successfully
[REGISTER] User created: { userId: '...', email: 'test1@example.com' }
```

---

### ✅ Test 1.2: User Login
**Objective**: Verify login stores tokens correctly

1. Go to `/login`
2. Fill form:
   - Email: `test1@example.com`
   - Password: `password123`
3. Click "Sign In"

**Expected Result**:
- ✅ Redirected to `/tasks`
- ✅ localStorage contains:
  - `accessToken`: JWT token (not "null", not "undefined")
  - `user`: JSON with userId, email, name, accessToken
- ✅ Zero error toasts shown

**Verify in DevTools**:
```javascript
console.log(localStorage.getItem('accessToken'));
// Should print: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

console.log(JSON.parse(localStorage.getItem('user')));
// Should print: { userId: '...', email: 'test1@example.com', ... }
```

---

## 📋 Test Suite 2: Task Loading (CRITICAL)

### ✅ Test 2.1: Initial Task Load
**Objective**: Verify tasks load once without repeated errors

1. After login, you're on `/tasks` page
2. Observe the UI for 5 seconds

**Expected Result**:
- ✅ Brief "Loading tasks..." spinner appears
- ✅ Disappears after 1-2 seconds
- ✅ "No tasks yet" message shown
- ✅ **CRITICAL**: Only ONE GET request to `/tasks` in Network tab
- ✅ **NO error toasts** shown
- ✅ **NO "3 errors" at bottom-left**

**Backend Check**:
```
Server running on http://localhost:3000 in development mode
[GET /tasks] → 200 OK (only once)
```

**DevTools Check (Network Tab)**:
1. Open DevTools → Network → Filter "Fetch/XHR"
2. Reload the page
3. Look for `GET /tasks` request
4. **Expected**: Only 1 request
5. **BAD**: Multiple requests (infinite loop)

---

### ✅ Test 2.2: Task Load with Error (Simulate)
**Objective**: Verify single error toast, not 3+

1. Go to `/tasks`
2. **Temporarily break the backend** (or disable network)
3. Reload page
4. Observe error toasts

**Expected Result**:
- ✅ Single "Failed to load tasks" error shown
- ✅ **NOT 3 errors stacked**
- ✅ Error remains for 3 seconds then auto-dismisses
- ✅ When you fix the backend, error clears and data loads

**DevTools Check**:
1. Open console
2. Look at Network tab
3. **Expected**: GET `/tasks` returns 5xx or 401

---

## 📋 Test Suite 3: Task CRUD Operations

### ✅ Test 3.1: Create Task
**Objective**: Verify task creation works

1. Click "New Task" button
2. Fill modal:
   - Title: "Buy groceries"
   - Description: "Milk, eggs, bread"
3. Click Submit

**Expected Result**:
- ✅ Modal closes immediately
- ✅ Task appears at top of list
- ✅ Green "Task created successfully" toast
- ✅ No error toasts
- ✅ Pagination updates if needed

**Backend Check**:
```
POST /tasks → 201 Created
```

---

### ✅ Test 3.2: Edit Task
**Objective**: Verify task editing

1. Click edit icon (pencil) on any task
2. Modify title: "Buy groceries and cook"
3. Click Submit

**Expected Result**:
- ✅ Modal closes
- ✅ Task updates in list
- ✅ "Task updated successfully" toast
- ✅ No error toasts

**Backend Check**:
```
PATCH /tasks/{id} → 200 OK
```

---

### ✅ Test 3.3: Toggle Task Status
**Objective**: Verify task completion toggle

1. Click on task card (anywhere on the task)
2. Task checkbox toggles

**Expected Result**:
- ✅ Checkbox updates immediately
- ✅ "Task status updated" toast
- ✅ Task moves visually (strikethrough, opacity change)
- ✅ Status filter works (select "Completed" shows completed tasks)

**Backend Check**:
```
PATCH /tasks/{id}/toggle → 200 OK
```

---

### ✅ Test 3.4: Delete Task
**Objective**: Verify task deletion

1. Click trash icon on any task
2. Task disappears

**Expected Result**:
- ✅ Task removed from list
- ✅ "Task deleted successfully" toast
- ✅ No error toasts
- ✅ Total count decreases

**Backend Check**:
```
DELETE /tasks/{id} → 204 No Content
```

---

### ✅ Test 3.5: Task Filtering
**Objective**: Verify search and status filtering

#### Filter by Status:
1. Select "Completed" from dropdown
2. Only completed tasks show

**Expected Result**: ✅ List updates with filtered tasks

#### Filter by Search:
1. Type "groceries" in search box
2. Only tasks with "groceries" in title shown

**Expected Result**: ✅ List filters as you type

---

## 📋 Test Suite 4: Error Handling & Edge Cases

### ✅ Test 4.1: No Duplicate Errors on Network Retry
**Objective**: Verify errors don't stack on retry

1. Simulate network failure
2. Load `/tasks`
3. See single error toast
4. Fix network/backend
5. Page should auto-recover or refresh

**Expected Result**:
- ✅ Only 1 error shown initially
- ✅ When fixed, error dismisses
- ✅ Tasks load successfully
- ✅ No stale error count

---

### ✅ Test 4.2: Session Persistence
**Objective**: Verify auth persists across page reloads

1. Login successfully
2. Refresh page (F5)
3. Should remain on `/tasks`

**Expected Result**:
- ✅ Still logged in
- ✅ Tasks load immediately
- ✅ No redirect to login
- ✅ User info displays (Welcome, [Name])

**Verify**:
```javascript
localStorage.getItem('accessToken') // Should exist
localStorage.getItem('user') // Should exist
```

---

### ✅ Test 4.3: Logout
**Objective**: Verify logout clears auth

1. Click "Logout" button
2. Confirm redirect to `/login`

**Expected Result**:
- ✅ Redirected to `/login`
- ✅ localStorage cleared (no accessToken)
- ✅ Try refreshing: still on `/login` (not `/tasks`)
- ✅ "Logged out successfully" toast

**Verify**:
```javascript
localStorage.getItem('accessToken') // null
localStorage.getItem('user') // null
```

---

### ✅ Test 4.4: Unauthorized Access
**Objective**: Verify unauthenticated users can't access `/tasks`

1. Logout completely
2. Try accessing http://localhost:3001/tasks directly
3. Should redirect to `/login`

**Expected Result**:
- ✅ Redirected to `/login`
- ✅ No API calls made
- ✅ No 401 errors in console

---

## 📋 Test Suite 5: Toast System Validation

### ✅ Test 5.1: No Toast Spam
**Objective**: Verify same error doesn't show multiple times

1. Create 3 intentional errors quickly:
   - Click "Create Task" → don't fill form → submit (validation error)
   - Submit again (same error)
   - Submit again

**Expected Result**:
- ✅ Error toast shown only ONCE
- ✅ Not 3 toasts stacked
- ✅ Toast has same ID being reused (detected from code)

---

### ✅ Test 5.2: Error Dismissal on Success
**Objective**: Verify error clears when operation succeeds

1. Attempt to create task with invalid data
2. See error toast
3. Fill form correctly
4. Submit successfully

**Expected Result**:
- ✅ Previous error toast dismissed
- ✅ Success toast shown
- ✅ No stale errors visible

---

## 🔍 Detailed Verification Checklist

### Browser DevTools - Network Tab
When on `/tasks` page:
```
✅ GET /tasks → 200 OK
✅ Authorization header present: "Bearer eyJ..."
✅ Response has: { data: [...], pagination: {...} }
✅ Only ONE request (not multiple)
```

### Browser DevTools - Console
```
✅ No red errors
✅ No auth-related warnings
✅ No infinite loops
```

### Browser DevTools - Application (Storage)
```
✅ localStorage.accessToken = "eyJ..." (valid JWT)
✅ localStorage.user = {...userId, email, name}
✅ No localStorage.accessToken = "null" or "undefined"
```

### Backend Logs
```
✅ Server started successfully
✅ POST /auth/register → 201 Created
✅ POST /auth/login → 200 OK
✅ GET /tasks → 200 OK
✅ POST /tasks → 201 Created
✅ PATCH /tasks/{id} → 200 OK
✅ DELETE /tasks/{id} → 204 No Content
✅ No 401 Unauthorized errors
✅ No PrismaClientInitializationError
```

---

## 📊 Success Criteria

All tests MUST pass:

| Test | Status |
|------|--------|
| Registration works | ✅ |
| Login stores token | ✅ |
| Tasks load once (no loop) | ✅ |
| No 3 errors shown | ✅ |
| Create task works | ✅ |
| Edit task works | ✅ |
| Toggle task works | ✅ |
| Delete task works | ✅ |
| Filter/search works | ✅ |
| No duplicate error toasts | ✅ |
| Errors dismiss on success | ✅ |
| Session persists | ✅ |
| Logout works | ✅ |
| Unauthenticated → login | ✅ |
| Network requests correct | ✅ |
| No console errors | ✅ |

---

## 🐛 If Tests Fail

### Problem: Still seeing "3 errors"
**Solution**:
1. Clear browser cache (DevTools → Storage → Clear All)
2. Restart frontend: `npm run dev`
3. Hard refresh: Ctrl+Shift+R

### Problem: Tasks not loading
**Solution**:
1. Check backend is running: `npm run dev` in backend folder
2. Check PostgreSQL running
3. Check .env has DATABASE_URL

### Problem: "Cannot find X token"
**Solution**:
1. Logout completely
2. Clear localStorage manually (DevTools → Storage)
3. Log in again

### Problem: 401 Unauthorized errors
**Solution**:
1. Token might be expired
2. Logout and login again
3. Check JWT_ACCESS_SECRET matches in .env

---

## ✅ Final Sign-Off

When all tests pass:

```
✅ Authentication: 100%
✅ Task CRUD: 100%
✅ Error Handling: 100%
✅ UX/Toasts: 100%
✅ Performance: No infinite loops
✅ Production Ready: YES
```

**Status**: Ready for deployment
