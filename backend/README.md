# EthixWeb Backend & Integration Documentation

This directory contains the production-grade Node.js + Express backend powering the EthixWeb customer enquiry flow and administrative lead management system.

---

## 1. Architecture Overview

- **Runtime & Framework:** Node.js (v18+) with Express.js.
- **Database:** Neon Serverless PostgreSQL with connection pooling via `pg`.
- **Validation:** Zod schemas parsing and sanitizing inputs.
- **Security:**
  - Helmet for standard HTTP security headers.
  - Strict CORS policy matching the Next.js frontend origin.
  - Rate limiting on public lead submission (`POST /api/leads`, 10 req/15min) and admin login (`POST /api/admin/login`, 5 attempts/15min).
  - JWT token verification and HttpOnly cookie fallback.
  - Fully parameterized SQL queries preventing SQL injection.

---

## 2. API Endpoints

### Public APIs
- `GET /api/health` — Checks service status and database connectivity.
- `POST /api/leads` — Submits a new customer enquiry.
  - Request Body: `{ name, email, projectSubject, message }`
  - Returns: `{ success: true, data: { id, name, email, project_subject, message, status, created_at } }`

### Protected Admin APIs (Requires `Authorization: Bearer <token>` or `admin_token` cookie)
- `POST /api/admin/login` — Authenticates admin credentials, sets HttpOnly cookie, and returns JWT.
- `POST /api/admin/logout` — Clears authentication cookie.
- `GET /api/admin/me` — Returns current authenticated admin profile.
- `GET /api/admin/leads?status=<status>` — Lists all enquiries with live metric counts (`total`, `new`, `contacted`, `qualified`, `closed`).
- `GET /api/admin/leads/:id` — Retrieves details for a specific lead.
- `PATCH /api/admin/leads/:id` — Updates lead workflow status (`new`, `contacted`, `qualified`, `closed`).
- `DELETE /api/admin/leads/:id` — Deletes an enquiry.

---

## 3. Database Schema

The database migration is located in `backend/sql/001_create_leads.sql`:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL,
    project_subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status_created_at ON leads(status, created_at DESC);
```

---

## 4. Local Development Setup

### Backend
1. Enter the `backend/` directory:
   ```bash
   cd backend
   npm install
   ```
2. Configure `.env` from `.env.example`:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=postgresql://neondb_owner:...@ep-...neon.tech/neondb?sslmode=require
   FRONTEND_ORIGIN=http://localhost:3000
   JWT_SECRET=super_secret_jwt_key_at_least_32_characters_long
   ADMIN_EMAIL=admin@ethixweb.com
   ADMIN_PASSWORD_HASH=$2b$10$...
   ```
3. Run the database migration:
   ```bash
   node src/database/migrate.js
   ```
4. Start the server:
   ```bash
   npm run dev   # or: npm start
   ```

### Frontend (`hero-app`)
1. Enter `hero-app/`:
   ```bash
   cd ../hero-app
   npm install
   ```
2. Configure `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
3. Start frontend dev server:
   ```bash
   npm run dev
   ```
4. Access the application:
   - Homepage: `http://localhost:3000/`
   - Contact Form: `http://localhost:3000/contact`
   - Admin Portal: `http://localhost:3000/admin`
