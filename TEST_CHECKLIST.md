# Test Checklist - Task Management Application

Use this checklist to verify all features are working correctly.

## Prerequisites
- ✅ Backend running on `http://localhost:3000`
- ✅ Frontend running on `http://localhost:3001`
- ✅ Database created and migrations run
- ✅ Both servers started without errors

---

## 🔐 Authentication Tests

### Registration
- [ ] Navigate to `http://localhost:3001/register`
- [ ] Enter valid full name, email, password
- [ ] Click "Create Account"
- [ ] Account is created and redirected to `/tasks`
- [ ] User name is displayed in top-right corner

### Registration Validation
- [ ] Try registering with short password (< 6 chars) → Shows error
- [ ] Try registering with invalid email format → Shows error
- [ ] Try registering with existing email → Shows error message
- [ ] Try leaving a field empty → Shows required error

### Login
- [ ] Logout (click logout button or use `/login` directly)
- [ ] Click "Sign in" link
- [ ] Enter same email and password used to register
- [ ] Click "Sign In"
- [ ] Redirected to `/tasks` with user data loaded

### Login Validation
- [ ] Try logging in with wrong password → Shows "Invalid credentials"
- [ ] Try logging in with non-existent email → Shows "Invalid credentials"
- [ ] Try leaving fields empty → Shows required error

### Token Refresh
- [ ] Login successfully
- [ ] Open DevTools (F12) → Application → Cookies
- [ ] Verify `refreshToken` exists and is HTTP-only
- [ ] Refresh the page (F5)
- [ ] User remains logged in without re-entering credentials
- [ ] New `accessToken` should be in localStorage

### Logout
- [ ] Click "Logout" button in top-right
- [ ] Redirected to `/login`
- [ ] Try going back to `/tasks` → Redirected to login
- [ ] Refresh token cookie is cleared

---

## 📝 Task Management Tests

### Create Task
- [ ] Click "New Task" button
- [ ] Modal opens with "New Task" title
- [ ] Enter task title (required)
- [ ] Enter task description (optional)
- [ ] Click "Create"
- [ ] Modal closes
- [ ] New task appears at top of list
- [ ] Toast shows "Task created successfully"

### Create Task Validation
- [ ] Click "New Task"
- [ ] Leave title empty and click "Create"
- [ ] Shows "Title is required" error
- [ ] Task is not created

### View Tasks
- [ ] Login and navigate to `/tasks`
- [ ] All user's tasks appear in a list
- [ ] Each task shows title, description, date, and status
- [ ] Tasks are sorted by most recent first

### Task Pagination
- [ ] Verify default page shows up to 10 tasks
- [ ] Click "Next" button
- [ ] Page number increments
- [ ] Next set of tasks appears
- [ ] Click "Previous"
- [ ] Returns to first page
- [ ] "Previous" button disabled on page 1
- [ ] "Next" button disabled on last page

### Search Tasks
- [ ] Enter search term in search box
- [ ] Results update in real-time
- [ ] Only tasks with matching title appear
- [ ] Search is case-insensitive
- [ ] Clear search box to show all tasks again
- [ ] Pagination resets to page 1 after search

### Filter by Status
- [ ] Select "Pending" from status dropdown
- [ ] Only pending tasks appear
- [ ] Select "Completed"
- [ ] Only completed tasks appear
- [ ] Select "All Status"
- [ ] All tasks appear

### Edit Task
- [ ] Click "Edit" button on a task card
- [ ] Modal opens with "Edit Task" title
- [ ] Current title and description are pre-filled
- [ ] Modify title and/or description
- [ ] Click "Update"
- [ ] Modal closes
- [ ] Task is updated with new values
- [ ] Toast shows "Task updated successfully"

### Toggle Task Status
- [ ] Click circle icon on a pending task
- [ ] Icon changes to checkmark (completed icon)
- [ ] Task title gets strikethrough styling
- [ ] Click completed task circle
- [ ] Icon reverts to empty circle
- [ ] Strikethrough is removed
- [ ] Status appears updated in database

### Delete Task
- [ ] Click trash icon on any task
- [ ] Task is deleted immediately
- [ ] Toast shows "Task deleted successfully"
- [ ] Task no longer appears in list
- [ ] Verify in database that task is removed

---

## 🎨 UI/UX Tests

### Responsive Design
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test on mobile view (375px width)
  - [ ] Layout is single column
  - [ ] All buttons and inputs are accessible
  - [ ] Text is readable
  - [ ] No horizontal scroll
- [ ] Test on tablet view (768px width)
  - [ ] Layout adapts appropriately
  - [ ] All features work
- [ ] Return to desktop view
  - [ ] Multi-column layout restored

### Visual Design
- [ ] Dark theme is applied throughout
- [ ] Purple primary color is visible (buttons, accents)
- [ ] Cyan, pink, amber, and emerald accents visible
- [ ] Text is clearly readable on dark background
- [ ] Gradients and shadows are visible
- [ ] Typography is consistent and professional
- [ ] Buttons have hover effects
- [ ] Inputs focus with purple outline

### Animations
- [ ] Buttons have scale animation on hover
- [ ] Buttons have scale animation on click
- [ ] Task cards fade in when created
- [ ] Task cards fade out when deleted
- [ ] Modal slides in smoothly
- [ ] Toast notifications slide in from right
- [ ] Toast notifications fade out

### Forms & Inputs
- [ ] Input fields have proper focus state
- [ ] Error messages display in red
- [ ] Placeholder text is visible
- [ ] Input text is clearly visible
- [ ] Form submission disables button (loading state)
- [ ] Loading spinner appears on buttons during submission

### Notifications
- [ ] Success toast appears for successful actions
- [ ] Error toast appears for failures
- [ ] Toast auto-dismisses after 3 seconds
- [ ] Multiple toasts stack vertically
- [ ] Toast text is readable with good contrast

---

## 🔄 Data Persistence Tests

### Local Storage
- [ ] After login, check localStorage:
  - [ ] `user` object contains userId, email, name
  - [ ] `accessToken` is present
- [ ] Refresh page (F5)
- [ ] User remains logged in
- [ ] All task data persists
- [ ] Logout clears localStorage

### Database
- [ ] Login with multiple users
- [ ] Create tasks for different users
- [ ] Verify each user only sees their own tasks
- [ ] Login as user A, create task
- [ ] Switch to user B
- [ ] Task from user A not visible
- [ ] Switch back to user A
- [ ] Original task is still there

---

## 🔐 Security Tests

### Token Security
- [ ] Refresh token is HTTP-only (not accessible via JS)
- [ ] DevTools → Application → Cookies → refreshToken is marked as "HttpOnly"
- [ ] Access token is in localStorage (visible in DevTools)
- [ ] Delete refreshToken cookie
- [ ] Try refreshing page
- [ ] User is logged out (session expired)

### Input Validation
- [ ] Try XSS attack in title: `<script>alert('xss')</script>`
- [ ] Task is created with script as text (not executed)
- [ ] Try SQL injection in search: `'; DROP TABLE tasks; --`
- [ ] No database error, just no results

### Protected Routes
- [ ] Try accessing `/tasks` without logging in
- [ ] Redirected to `/login`
- [ ] Manual token deletion: Open DevTools → Application → Storage → localStorage
- [ ] Delete `accessToken`
- [ ] Try accessing any protected endpoint
- [ ] Request fails with 401 Unauthorized
- [ ] Frontend redirects to login

---

## 🐛 Error Handling Tests

### Network Errors
- [ ] Disconnect internet
- [ ] Try creating a task
- [ ] Shows appropriate error message
- [ ] Reconnect internet

### Invalid Responses
- [ ] Open DevTools → Network tab
- [ ] Create a task
- [ ] Verify response is valid JSON
- [ ] Check status code is 201

### Validation Errors
- [ ] Try updating task with empty title
- [ ] Shows "Title is required" error
- [ ] Form doesn't submit
- [ ] Error clears on valid input

### Not Found
- [ ] Manually edit URL to `/tasks/invalid-id`
- [ ] Task not found or 404 error
- [ ] Shows appropriate error message

---

## 📊 API Tests

### Using cURL or Postman

#### Register
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```
- [ ] Returns 201 status
- [ ] Response includes accessToken

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```
- [ ] Returns 200 status
- [ ] Response includes accessToken
- [ ] Cookies saved with refreshToken

#### Get Tasks
```bash
curl http://localhost:3000/tasks?page=1&limit=10 \
  -H "Authorization: Bearer ACCESS_TOKEN_HERE"
```
- [ ] Returns 200 status
- [ ] Response includes data array and pagination

#### Create Task
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN_HERE" \
  -d '{
    "title": "Test Task"
  }'
```
- [ ] Returns 201 status
- [ ] Task has auto-generated id
- [ ] Status is PENDING by default

---

## ✅ Final Verification

### All Features Working
- [ ] User can register
- [ ] User can login
- [ ] User can logout
- [ ] User can create tasks
- [ ] User can edit tasks
- [ ] User can delete tasks
- [ ] User can toggle task status
- [ ] User can search tasks
- [ ] User can filter tasks
- [ ] User can paginate tasks
- [ ] UI is responsive
- [ ] Animations work smoothly
- [ ] Notifications appear correctly
- [ ] Data persists across sessions
- [ ] Each user sees only their tasks
- [ ] Errors are handled gracefully

### No Broken Features
- [ ] No console errors
- [ ] No JavaScript errors
- [ ] No network errors
- [ ] No unhandled promises
- [ ] All buttons work
- [ ] All links work
- [ ] All forms validate properly

### Performance
- [ ] Page loads quickly
- [ ] No lag when creating/editing/deleting tasks
- [ ] Animations are smooth (60 fps)
- [ ] Scrolling is smooth
- [ ] Search updates in real-time without lag

---

## 🎉 Test Summary

**Total Tests**: ~80+  
**Pass Criteria**: All tests should pass ✅

After completing all tests above, the application is ready for production use.

---

**Test Date**: _______________  
**Tester Name**: _______________  
**Status**: ⬜ Passed / ⬜ Failed
