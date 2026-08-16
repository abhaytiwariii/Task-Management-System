# Task Management System

A full-stack task management application for organizing projects and tasks through a Kanban-style board.

## Live Demo

- **Frontend:** https://task-management-abhay.vercel.app/
- **Backend API:** https://task-management-system-desw.onrender.com/
- **GitHub:** https://github.com/abhaytiwariii/Task-Management-System

## Features

- Guest login and Google authentication
- Create, view, and delete projects
- Create, edit, and delete tasks
- Kanban-style task board
- Drag-and-drop task status updates
- Task priorities
- Due dates
- Task search/filtering
- Board and list views
- Responsive dashboard UI
- Persistent data through a backend API and PostgreSQL database

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Zustand
- Axios
- Tailwind CSS
- `@hello-pangea/dnd` for drag-and-drop
- Supabase Auth for Google OAuth

### Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- `class-validator` / `class-transformer`

## Architecture

The application follows a simple full-stack architecture:

```text
Frontend (Next.js)
       |
       | Axios / REST API
       v
Backend (NestJS)
       |
       | Prisma
       v
PostgreSQL
```

The main data relationships are:

```text
User
 ├── Projects
 └── Tasks

Project
 └── Tasks
```

The frontend manages application state using Zustand. API requests are handled by the NestJS backend, which validates requests and uses Prisma to read and write data in PostgreSQL.

## Project Structure

```text
Task-Management-System/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── store/
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── prisma/
│   │   └── ...
│   └── prisma/
│       └── schema.prisma
│
└── README.md
```

## Running Locally

### Prerequisites

Make sure you have installed:

- Node.js 18+
- npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/abhaytiwariii/Task-Management-System.git
cd Task-Management-System
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="your_postgresql_connection_string"
```

If Google authentication is being used locally, configure the required Supabase environment variables as used by the frontend.

Generate Prisma Client:

```bash
npx prisma generate
```

Apply the database schema/migrations:

```bash
npx prisma migrate dev
```

Start the backend:

```bash
npm run start:dev
```

The backend will run on the configured local port.

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
```

Create the required `.env.local` file with the backend API URL and Supabase configuration used by the application.

For example:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

Start the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Key Design Decisions

- **Next.js + React:** Used for the interactive task-management interface and routing.
- **NestJS:** Used to keep backend controllers, services, validation, and modules separated and maintainable.
- **Prisma + PostgreSQL:** Used for structured relational data and type-safe database access.
- **Zustand:** Used for lightweight client-side state management without the overhead of a larger state-management solution.
- **Optimistic task updates:** Drag-and-drop status changes update the UI immediately and then persist the change through the backend.
- **Supabase:** Used to provide Google OAuth while keeping application user records in the PostgreSQL database.

## Assumptions

- The application is designed primarily as a lightweight task/project management system rather than a full enterprise collaboration platform.
- A task can optionally belong to a project.
- Task status represents the Kanban column in which the task appears.
- Authentication is kept lightweight for this project and is not intended to implement a complete enterprise identity/permission system.

## What I Would Improve With More Time

- Add stronger server-side authentication and authorization.
- Verify resource ownership on every project/task update and delete operation.
- Improve user-facing error messages and loading states.
- Add more comprehensive backend and database tests.
- Add pagination and more efficient querying for larger datasets.
- Improve database indexing for frequently filtered fields.
- Add automated CI checks for linting, tests, and builds.
- Improve the deployment and environment configuration documentation.

## What I Learned

One of the more interesting parts of the project was implementing optimistic updates for drag-and-drop task movement. The UI updates immediately when a task is moved, while the backend request persists the change. If the request fails, the previous state can be restored. This helped me understand how frontend responsiveness and backend consistency can be balanced in a real application.

## Deployment

The project is deployed using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** PostgreSQL

## Notes

The project prioritizes a clean, functional task-management workflow and a clear separation between frontend, backend, and database responsibilities.
