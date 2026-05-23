# DevPulse 🚀

> Internal Tech Issue & Feature Tracker — A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

---

## Live URL

> `http://localhost:7000` (Development)

---

## Features

- User registration and login with JWT authentication
- Role-based access control (contributor & maintainer)
- Create, read, update, and delete issues
- Filter and sort issues by type and status
- Reporter details embedded in issue responses
- Secure password hashing with bcrypt
- Protected routes with middleware-based auth

---

## Tech Stack

| Technology         | Purpose                       |
| ------------------ | ----------------------------- |
| Node.js (24.x)     | Runtime environment           |
| TypeScript         | Type-safe development         |
| Express.js         | Modular REST API framework    |
| PostgreSQL         | Relational database           |
| pg (native driver) | Raw SQL queries               |
| bcryptjs           | Password hashing              |
| jsonwebtoken       | JWT generation & verification |
| Neon               | Cloud PostgreSQL hosting      |

---

## Getting Started

### 1. Navigate to the project directory

```bash
cd devpulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
PORT=7000
DATABASE_URL="postgresql://your_neon_connection_string"
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_SECRET_EXPIRES_IN=1d
```

### 4. Start the server

```bash
npm run dev
```

---

## Database Schema

### Table 1: `users`

| Field      | Type                              | Description                         |
| ---------- | --------------------------------- | ----------------------------------- |
| id         | SERIAL PRIMARY KEY                | Auto-incrementing unique identifier |
| name       | VARCHAR(100)                      | Full display name                   |
| email      | VARCHAR(100) UNIQUE NOT NULL      | Login address                       |
| password   | TEXT NOT NULL                     | Bcrypt hashed password              |
| role       | VARCHAR(20) DEFAULT 'contributor' | contributor or maintainer           |
| created_at | TIMESTAMP WITH TIME ZONE          | Auto-generated on insert            |
| updated_at | TIMESTAMP WITH TIME ZONE          | Auto-updated on update              |

### Table 2: `issues`

| Field       | Type                       | Description                         |
| ----------- | -------------------------- | ----------------------------------- |
| id          | SERIAL PRIMARY KEY         | Auto-incrementing unique identifier |
| title       | VARCHAR(150) NOT NULL      | Short descriptive headline          |
| description | TEXT NOT NULL              | Detailed explanation                |
| type        | VARCHAR(20) NOT NULL       | bug or feature_request              |
| status      | VARCHAR(20) DEFAULT 'open' | open, in_progress, or resolved      |
| reporter_id | INT NOT NULL               | References users(id)                |
| created_at  | TIMESTAMP WITH TIME ZONE   | Auto-generated on insert            |
| updated_at  | TIMESTAMP WITH TIME ZONE   | Auto-updated on update              |

---

## API Endpoints

### Authentication Module

| Method | Endpoint           | Access | Description                 |
| ------ | ------------------ | ------ | --------------------------- |
| POST   | `/api/auth/signup` | Public | Register a new user         |
| POST   | `/api/auth/login`  | Public | Login and receive JWT token |

### Issues Module

| Method | Endpoint          | Access          | Description                            |
| ------ | ----------------- | --------------- | -------------------------------------- |
| POST   | `/api/issues`     | Authenticated   | Create a new issue                     |
| GET    | `/api/issues`     | Public          | Get all issues (with optional filters) |
| GET    | `/api/issues/:id` | Public          | Get a single issue                     |
| PATCH  | `/api/issues/:id` | Authenticated   | Update an issue                        |
| DELETE | `/api/issues/:id` | Maintainer only | Delete an issue                        |

---

## User Roles & Permissions

| Role        | Allowed Actions                                                                       |
| ----------- | ------------------------------------------------------------------------------------- |
| contributor | Register, login, create issues, view all issues, update own open issues               |
| maintainer  | All contributor permissions + update any issue, delete any issue, change issue status |

---

## Request & Response Examples

### POST `/api/auth/signup`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@devpulse.com",
    "role": "contributor",
    "created_at": "2026-01-20T09:00:00Z",
    "updated_at": "2026-01-20T09:00:00Z"
  }
}
```

### POST `/api/issues`

**Headers:** `Authorization: Bearer <JWT_TOKEN>`

**Request Body:**

```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T10:30:00Z"
  }
}
```

---

## Common Response Patterns

**Success:**

```json
{
  "success": true,
  "message": "Operation description",
  "data": "Response data"
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Project Structure

```
src/
├── config/         # Environment config
├── db/             # Database connection & init
├── middleware/     # auth, validateIssue
├── modules/
│   ├── auth/       # Signup & Login
│   └── issue/      # CRUD operations
├── types/          # TypeScript types
├── utils/          # sendResponse helper
├── app.ts
└── server.ts
```
