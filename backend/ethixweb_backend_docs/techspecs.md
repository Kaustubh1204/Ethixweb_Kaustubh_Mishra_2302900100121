# EthixWeb India — Backend Technical Specifications

## 1. Architecture

Keep the frontend in its current framework and repository location. Implement the API as an independent Node.js/Express application in `backend/`.

```text
Existing website
  ├─ Contact form ── POST /api/leads ──┐
  └─ Admin UI ───── /api/admin/* ──────┤
                                       ▼
                              Node.js + Express
                         validation / auth / limits
                                       ▼
                                Neon PostgreSQL
```

Deploy the frontend and backend independently if required by the existing hosting setup. Configure the frontend API base URL through its environment configuration. Never put database or admin secrets in client-side environment variables.

## 2. Stack

- Runtime: Node.js LTS compatible with the deployment host.
- API: Express.
- Database: Neon PostgreSQL.
- Driver: `pg`.
- Validation: Zod (or one equivalent validation library used consistently).
- Security: `helmet`, configured CORS, and `express-rate-limit`.
- Authentication: server-verified admin authentication. Prefer a mature auth provider/library if already configured; otherwise use password hashing with Argon2id or bcrypt and a secure, HTTP-only session cookie. Do not implement a home-grown token scheme without a clear need.
- Tests: Node test runner or the test framework already present in the repository.

Do not add Nodemailer, OTP, Redis, WebSockets, a message queue, or additional infrastructure for this MVP.

## 3. Suggested directory structure

Adapt this structure to the repository's conventions. Audit before creating files or moving anything.

```text
backend/
  src/
    app.js
    server.js
    config/
      env.js
      database.js
    routes/
      health.routes.js
      leads.routes.js
      admin-auth.routes.js
      admin-leads.routes.js
    controllers/
      leads.controller.js
      admin-auth.controller.js
      admin-leads.controller.js
    middleware/
      require-admin.js
      rate-limit.js
      validate.js
      error-handler.js
    schemas/
      lead.schema.js
      admin.schema.js
    services/
      leads.service.js
    repositories/
      leads.repository.js
  sql/
    001_create_leads.sql
  tests/
  .env.example
  .gitignore
  package.json
  README.md
```

Avoid unnecessary layers if the project is small; keep validation, database access, authentication, and error handling clearly separated.

## 4. Environment variables

Required server-side configuration:
- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `FRONTEND_ORIGIN`
- Admin authentication configuration appropriate to the selected method, such as `ADMIN_EMAIL` and a securely hashed admin password or a provider/session secret.

Provide `.env.example` with placeholder values only. Never commit `.env`, real credentials, session secrets, or production connection strings. Configure production secrets in the deployment platform. Use TLS/SSL for the hosted database as required by Neon.

## 5. API contract

All responses use JSON. Suggested success shape: `{ "success": true, "data": ... }`. Suggested error shape: `{ "success": false, "error": { "code": "...", "message": "..." } }`. Keep the exact format consistent across endpoints.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/health` | Public | Basic health check |
| `POST` | `/api/leads` | Public, rate-limited | Create enquiry |
| `POST` | `/api/admin/login` | Public, rate-limited | Authenticate admin |
| `POST` | `/api/admin/logout` | Authenticated | End admin session |
| `GET` | `/api/admin/me` | Authenticated | Verify current admin session |
| `GET` | `/api/admin/leads` | Authenticated | List leads, with optional search/status filters |
| `GET` | `/api/admin/leads/:id` | Authenticated | View lead details |
| `PATCH` | `/api/admin/leads/:id` | Authenticated | Update allowed fields, initially status |
| `DELETE` | `/api/admin/leads/:id` | Authenticated | Delete lead |

Use `401` for missing/invalid authentication, `403` for insufficient permission, `404` for missing records, `400` or `422` for invalid input, `429` for rate limits, and `500` for unexpected failures.

### Create lead request

```json
{
  "name": "Example Visitor",
  "email": "visitor@example.com",
  "projectSubject": "Website redesign",
  "message": "We need a responsive website for our business."
}
```

The backend maps `projectSubject` to the database column `project_subject`. If the existing frontend already uses a different property name, preserve the UI contract and map it explicitly rather than silently breaking the form.

## 6. Validation and anti-spam

- Trim text inputs and reject empty required fields.
- Validate email format and reasonable maximum lengths.
- Enforce a message length limit; reject unexpected types and unknown fields.
- Validate admin status updates against the exact allowed enum.
- Use a honeypot field only if it can be added without changing the visible form; otherwise use rate limiting and server-side heuristics.
- Apply a conservative per-IP rate limit to public lead creation and admin login.
- Do not log full enquiry messages, passwords, session identifiers, or secrets.
- Do not trust client-supplied status, IDs, or admin identity.

## 7. Database access

- Use parameterized queries through `pg`.
- Use a connection pool and a single shared database module.
- Keep SQL migrations in `backend/sql/`.
- Store timestamps as `TIMESTAMPTZ`; PostgreSQL stores instants independently of display timezone.
- Return only fields needed by the UI.
- Add pagination or a reasonable result limit to the admin listing.
- Do not expose the database connection directly to the browser.

## 8. Admin security

- Protect every `/api/admin/*` endpoint except the login endpoint.
- Validate the session on the server for each protected request.
- Use `HttpOnly`, `Secure` in production, and appropriate `SameSite` cookie settings.
- If cookie-based sessions are used, configure allowed origins and credentials carefully; use CSRF protection where the session/auth setup requires it.
- Store passwords only as strong salted hashes if local password authentication is selected.
- Use generic login failure messages and rate-limit login attempts.
- Do not hardcode production admin credentials in frontend code, README, source control, or committed seed files.
- A hidden `/admin` route is not an access-control mechanism.

## 9. Frontend integration

- First identify whether the current frontend is Vite, Next.js, or another framework.
- Preserve existing components and styles; change only form submission/state handling and the existing admin page as needed.
- Configure an API base URL using the framework's correct environment-variable convention.
- Disable duplicate submission while loading.
- Show success only after a confirmed API success response.
- On failure, show a readable error and retain entered values where practical.
- Do not expose backend secrets in frontend environment variables.

## 10. Verification

- Test valid lead creation and database persistence.
- Test missing fields, invalid email, long payloads, invalid status, and unknown IDs.
- Test unauthenticated access to every admin endpoint.
- Test login rate limiting and lead submission rate limiting.
- Test list, details, status update, and deletion.
- Test CORS from the deployed frontend origin.
- Run frontend build and backend tests before deployment.
