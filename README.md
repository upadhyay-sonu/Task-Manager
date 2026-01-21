# Task Management Web Application

A production-ready Task Management application with a secure backend API and modern luxury frontend UI.

## 📋 Features

### Backend
- ✅ JWT Authentication (Access & Refresh Tokens)
- ✅ User Registration & Login
- ✅ Secure Password Hashing (bcrypt)
- ✅ Task CRUD Operations
- ✅ Pagination, Filtering & Search
- ✅ User-specific Task Management
- ✅ Error Handling & Validation
- ✅ TypeScript (Strict Mode)

### Frontend
- ✅ Modern Luxury UI Design
- ✅ Dark Theme with Multicolor Accents
- ✅ Responsive Design (Desktop & Mobile)
- ✅ Authentication Flow
- ✅ Task Dashboard
- ✅ Real-time Toast Notifications
- ✅ Smooth Animations & Transitions
- ✅ TypeScript

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API**: Express.js
- **Authentication**: JWT + bcrypt
- **Validation**: Custom DTO/Schema

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **UI Components**: Custom built

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/task_management"
   JWT_ACCESS_SECRET="your-super-secret-access-token-key-min-32-chars"
   JWT_REFRESH_SECRET="your-super-secret-refresh-token-key-min-32-chars"
   JWT_ACCESS_EXPIRY="15m"
   JWT_REFRESH_EXPIRY="7d"
   PORT=3000
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:3001"
   ```

4. **Setup database**
   ```bash
   npm run prisma:migrate
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   Application will run on `http://localhost:3001`

## 🚀 Usage

### Register & Login
1. Visit `http://localhost:3001`
2. Create a new account or login with existing credentials
3. Access token is stored in localStorage, refresh token in HTTP-only cookie

### Create Tasks
1. Click "New Task" button
2. Enter task title (required) and optional description
3. Task is immediately saved to database

### Manage Tasks
- **View**: All tasks appear in the dashboard with pagination
- **Search**: Use search bar to find tasks by title
- **Filter**: Filter by status (Pending/Completed)
- **Edit**: Click "Edit" button to modify task details
- **Toggle**: Click checkbox to mark task as complete
- **Delete**: Click trash icon to remove task

### Pagination
- Default 10 tasks per page
- Navigate between pages using Previous/Next buttons
- Page resets when searching or filtering

## 📚 API Endpoints

### Authentication
```
POST   /auth/register          # Create new user
POST   /auth/login             # User login
POST   /auth/refresh           # Refresh access token
POST   /auth/logout            # User logout
```

### Tasks (Protected)
```
GET    /tasks                  # List all user tasks (with pagination, filter, search)
POST   /tasks                  # Create new task
GET    /tasks/:id              # Get specific task
PATCH  /tasks/:id              # Update task
PATCH  /tasks/:id/toggle       # Toggle task status
DELETE /tasks/:id              # Delete task
```

### Query Parameters for GET /tasks
```
page=1           # Page number (default: 1)
limit=10         # Items per page (default: 10)
status=PENDING   # Filter by status (PENDING or COMPLETED)
search=keyword   # Search by title
```

## 🔐 Security Features

- **JWT Tokens**: 15-minute access tokens, 7-day refresh tokens
- **Password Hashing**: bcrypt with 12 rounds
- **HTTP-only Cookies**: Refresh tokens stored securely
- **CORS**: Configured for frontend domain
- **Input Validation**: Request body validation with DTOs
- **Error Handling**: Centralized error handler with proper status codes
- **TypeScript Strict Mode**: Full type safety

## 🎨 Design System

### Colors
- **Primary**: Purple (#8b5cf6)
- **Accents**: Cyan, Pink, Amber, Emerald
- **Dark Theme**: Dark-900 to Dark-500

### Typography
- **Font**: Inter (system-ui fallback)
- **Sizes**: SM (12px) to LG (18px)
- **Weights**: 300-800

### Components
- **Buttons**: Primary, Secondary, Outline, Danger
- **Inputs**: Text, TextArea with validation
- **Cards**: Task cards with hover effects
- **Modals**: Task creation/editing modal
- **Toasts**: Success, Error, Info notifications

## 📁 Project Structure

```
task-management/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Utilities
│   │   └── index.ts           # Server entry point
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── tasks/
│   │   │   └── layout.tsx
│   │   ├── components/        # Reusable components
│   │   ├── lib/               # Utilities & API client
│   │   ├── store/             # Zustand state management
│   │   ├── styles/            # Global styles
│   │   └── types/             # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── .env.example
│
├── .gitignore
└── README.md
```

## 🧪 Testing the Application

### Test Credentials
Create accounts through the registration page with any valid email and password (min 6 chars).

### Manual Testing Checklist
- [ ] Register new user
- [ ] Login with credentials
- [ ] Auto-login on page refresh (token refresh)
- [ ] Create task
- [ ] Edit task
- [ ] Toggle task status
- [ ] Delete task
- [ ] Search tasks
- [ ] Filter by status
- [ ] Paginate tasks
- [ ] Logout
- [ ] Verify token refresh on 401
- [ ] Verify form validation
- [ ] Test responsive design

## 🐛 Common Issues & Solutions

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Run `npm run prisma:generate`

### Port Already in Use
- Change PORT in .env (backend) or port in `next dev -p XXXX` (frontend)

### Token Expired
- Refresh token automatically triggers on 401
- Clear localStorage and login again if issues persist

### CORS Error
- Verify FRONTEND_URL in backend .env
- Ensure credentials: true in axios interceptor

## 📝 Environment Variables Reference

### Backend (.env)
```
DATABASE_URL              PostgreSQL connection string
JWT_ACCESS_SECRET         Min 32 chars, unique
JWT_REFRESH_SECRET        Min 32 chars, unique
JWT_ACCESS_EXPIRY         Token expiry (e.g., "15m")
JWT_REFRESH_EXPIRY        Token expiry (e.g., "7d")
PORT                      Server port (default: 3000)
NODE_ENV                  development/production
FRONTEND_URL              Frontend URL for CORS
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL       Backend API URL
```

## 📄 License

This project is proprietary and for demonstration purposes.

## 🤝 Support

For issues or questions, please check the code comments and error messages for guidance.

---

**Version**: 1.0.0  
**Last Updated**: January 2026
