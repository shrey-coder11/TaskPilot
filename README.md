# TaskPilot - Team Task Manager

TaskPilot is a complete full-stack web application for managing team projects and tasks with role-based access control. Built with React, Node.js, and MongoDB.

## Features

### Authentication
- User signup and login with JWT
- Role-based access control (Admin and Member)
- Protected routes and token management
- Secure logout functionality

### Project Management
- Create projects (Admin only)
- View assigned projects (Members)
- Add team members to projects by email
- View all projects (Admin)

### Task Management
- Create tasks with description, due date, and assignment (Admin only)
- Assign tasks to team members
- Update task status: Pending → In Progress → Completed
- Track overdue tasks
- View only assigned tasks (Members)
- Members can update status for their assigned tasks

### Dashboard
- View task statistics:
  - Total tasks
  - Pending tasks
  - In Progress tasks
  - Completed tasks
  - Overdue tasks
- Recent tasks table
- Quick access to important information

### UI/UX
- Clean, modern dashboard design
- Responsive design with Tailwind CSS
- Role-based navigation menu
- Error handling and validation
- Loading states

## Tech Stack

### Backend
- **Node.js & Express.js** - REST API server
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

## Installation

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):


4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Project Endpoints
- `POST /api/projects` - Create project (admin only)
- `GET /api/projects` - Get all projects (admin) or assigned projects (member)
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id/add-member` - Add member to project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

### Task Endpoints
- `POST /api/tasks` - Create task (admin only)
- `GET /api/tasks` - Get all tasks (admin) or assigned tasks (member)
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task details (admin only)
- `PUT /api/tasks/:id/status` - Update task status
- `DELETE /api/tasks/:id` - Delete task (admin only)

### Dashboard Endpoint
- `GET /api/dashboard` - Get dashboard statistics

## Project Structure

```
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── dashboardRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RoleRoute.jsx
│   │   │   └── DashboardCard.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── CreateProject.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── CreateTask.jsx
│   │   │   └── NotFound.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── package.json
│   └── .env.local
```

## Usage

### Admin User
1. Sign up with role "Admin"
2. Create projects and add team members
3. Create tasks and assign to team members
4. Track task progress and manage all projects/tasks

### Member User
1. Sign up with role "Member"
2. View assigned projects and tasks
3. Update task status for assigned tasks
4. View dashboard with personal task statistics

## Deployment

### Deploy Backend to Railway

1. Create a Railway account at [railway.app](https://railway.app)

2. Push your code to GitHub

3. Connect your GitHub repository to Railway

4. Set environment variables:
   - `MONGO_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret
   - `PORT` - 5000 (Railway will use process.env.PORT)
   - `NODE_ENV` - production

5. Railway will automatically deploy from main branch

### Deploy Frontend to Railway

1. Add build command in Railway:
   ```bash
   npm install && npm run build
   ```

2. Set start command:
   ```bash
   npm run preview
   ```

3. Update `VITE_API_URL` to your Railway backend URL

4. Deploy and Railway will handle the rest

## Features Implemented

✅ User authentication with JWT
✅ Role-based access control (Admin/Member)
✅ Project management and team collaboration
✅ Task creation and assignment
✅ Task status tracking
✅ Dashboard with statistics
✅ Overdue task detection
✅ Responsive design
✅ Error handling
✅ Form validation
✅ Protected routes
✅ Token persistence
✅ Logout functionality


---

**Happy task managing with TaskPilot! 📋**
