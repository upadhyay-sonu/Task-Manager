# Toast System - Quick Reference
## Error Toast Deduplication - Implementation Guide

**Status**: ✅ FIXED - Production Ready

---

## The Problem (Was)

❌ Error toasts appearing multiple times  
❌ Error messages not clearing on success  
❌ "2 errors" showing when tasks load  
❌ Duplicate toasts allowed  

## The Solution (Now)

✅ Each error has unique ID  
✅ Only one toast per operation  
✅ Auto-cleared on success  
✅ Duplicate prevention built-in  

---

## How to Use

### In Components

**Standard Pattern**:
```typescript
const operation = "my-operation";
const errorId = `${operation}-error`;

try {
  // API call
  const response = await api.myOperation();
  
  // Success: clear error
  toast.dismiss(errorId);
  toast.success("Success message");
} catch (error: any) {
  // Error: show with ID
  toast.error("Error message", { id: errorId });
}
```

### Real Examples

**Load Tasks**:
```typescript
try {
  const response = await taskApi.list({ ... });
  setTasks(response.data.data);
  toast.dismiss("load-tasks-error");
} catch (error: any) {
  toast.error(error.response?.data?.message, { 
    id: "load-tasks-error" 
  });
}
```

**Create Task**:
```typescript
try {
  const response = await taskApi.create(data);
  addTask(response.data);
  toast.dismiss("create-task-error");
  toast.success("Task created successfully");
} catch (error: any) {
  toast.error(error.response?.data?.message, { 
    id: "create-task-error" 
  });
  throw error;
}
```

---

## Error IDs Used

| Operation | Error ID |
|-----------|----------|
| Load tasks | `"load-tasks-error"` |
| Create task | `"create-task-error"` |
| Update task | `"update-task-error"` |
| Toggle task | `"toggle-task-error"` |
| Delete task | `"delete-task-error"` |
| Login | `"login-error"` |
| Register | `"register-error"` |

---

## Key Points

✅ **Always use ID**: `toast.error(msg, { id: "operation-error" })`  
✅ **Dismiss on success**: `toast.dismiss("operation-error")`  
✅ **Same ID = no duplicate**: Automatically prevented  
✅ **Auto-dismiss**: Toasts disappear after 3 seconds  

---

## What Happens Behind the Scenes

1. `toast.error()` called with ID
2. Check if toast ID already active
3. If yes: Return (no duplicate)
4. If no: Show toast, track timeout
5. After 3 seconds: Auto-dismiss
6. `toast.dismiss()` called
7. Remove from map, clear timeout
8. Toast disappears from UI

---

## Don't Do This

❌ Multiple error calls without ID
```typescript
// Bad: Allows duplicates
toast.error("Message 1");
toast.error("Message 2");
toast.error("Message 1"); // Duplicate!
```

❌ Error without dismissing on success
```typescript
// Bad: Error persists
toast.error("Failed", { id: "op-error" });
// ... success happens but no dismiss
toast.success("Success");
// Now both error and success shown!
```

❌ Creating new error IDs each time
```typescript
// Bad: Non-unique ID
const errorId = `error-${Date.now()}`; // Different each time!
```

---

## Do This Instead

✅ Consistent error ID per operation
```typescript
const errorId = "operation-name-error"; // Same each time
```

✅ Always dismiss on success
```typescript
try {
  // success
  toast.dismiss(errorId);
  toast.success("Success!");
} catch (error) {
  toast.error(msg, { id: errorId });
}
```

✅ One ID per operation type
```typescript
"load-tasks-error"  // Loading
"create-task-error" // Creating
"update-task-error" // Updating
"delete-task-error" // Deleting
```

---

## Testing Your Implementation

**Test 1: No Duplicates**
1. Trigger error twice
2. See only ONE toast
3. ✅ Pass

**Test 2: Success Clears Error**
1. Trigger error
2. Operation succeeds
3. Error disappears
4. ✅ Pass

**Test 3: Multiple Operations**
1. Trigger create error
2. Trigger update error
3. See TWO different toasts
4. ✅ Pass

**Test 4: No Stale Messages**
1. Trigger error
2. Wait 3+ seconds
3. Error auto-dismisses
4. ✅ Pass

---

## Files Modified

- `frontend/src/components/Toast.tsx` - Core system
- `frontend/src/app/tasks/page.tsx` - Task operations
- `frontend/src/app/login/page.tsx` - Login error
- `frontend/src/app/register/page.tsx` - Register error

---

## API Reference

### useToast Hook

```typescript
const toast = useToast();

// Show success toast
toast.success(message: string, options?: {
  id?: string;      // Optional unique ID
  duration?: number; // Milliseconds (default: 3000)
});

// Show error toast
toast.error(message: string, options?: {
  id?: string;      // Use unique ID!
  duration?: number; // Milliseconds (default: 3000)
});

// Show info toast
toast.info(message: string, options?: {
  id?: string;
  duration?: number;
});

// Manually dismiss toast
toast.dismiss(id: string);
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No ID on error | Add `{ id: "operation-error" }` |
| Error not dismissed | Add `toast.dismiss(errorId)` on success |
| Different ID each time | Use constant string: `"operation-error"` |
| Forgetting the pattern | Follow standard try/catch pattern |
| No success clear | Always dismiss error on success |

---

## Performance

- **Speed**: O(1) duplicate check
- **Memory**: Minimal (only active toasts)
- **No Leaks**: Timeouts properly cleared
- **No Overhead**: No impact on app performance

---

## Summary

| Aspect | Solution |
|--------|----------|
| **Duplicates** | Unique ID + deduplication check |
| **Stale Messages** | Dismiss on success |
| **Memory Leaks** | Timeout tracking & cleanup |
| **Consistency** | Standard pattern for all operations |
| **User Experience** | Clean, professional feedback |

---

**Implementation**: ✅ Complete  
**Testing**: ✅ All cases covered  
**Production**: ✅ Ready to deploy  

For detailed documentation, see: `TOAST_SYSTEM_FIX.md`
