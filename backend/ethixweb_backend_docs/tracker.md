# EthixWeb India — Backend Implementation Tracker

Use this tracker as the implementation source of truth. Mark a task `[x]` only after it is implemented and verified. Generated code or a successful build alone is not sufficient.

## Status legend

- `[ ]` Not started
- `[x]` Implemented and verified
- `[!]` Blocked / needs a decision

## Phase 0 — Audit existing project

- [x] Identify frontend framework, package manager, scripts, routes, and environment-variable conventions.
- [x] Inspect the existing Contact form and confirm its actual field names.
- [x] Inspect the existing Admin page and current route guard, if any.
- [x] Confirm repository structure and create a separate `backend/` directory without moving or rewriting the frontend.
- [x] Record the frontend API base URL strategy and intended deployment hosts.
- [x] Preserve existing navbar, sections, styles, and animations.

## Phase 1 — Backend foundation

- [x] Initialize Node.js and Express inside `backend/`.
- [x] Add `backend/.env.example` with placeholders only.
- [x] Ensure `.env` and other secret files are ignored by Git.
- [x] Add environment-variable validation at startup.
- [x] Add shared PostgreSQL connection pool.
- [x] Add `GET /api/health`.
- [x] Add JSON parsing, Helmet, explicit CORS, 404 handling, and centralized error middleware.
- [x] Add consistent success/error response conventions.

## Phase 2 — Database

- [x] Create Neon PostgreSQL database.
- [x] Add SQL migration for the `leads` table and indexes in `schema.md`.
- [x] Apply migration to the target database.
- [x] Verify a test insert and read using parameterized queries.
- [x] Verify that the database URL is never exposed to the frontend or committed.

## Phase 3 — Public enquiry API

- [x] Implement `POST /api/leads`.
- [x] Validate `name`, `email`, `projectSubject`, and `message` on the server.
- [x] Map `projectSubject` to `project_subject`.
- [x] Add rate limiting and a practical anti-spam measure.
- [x] Return the saved lead's safe public fields and a consistent response.
- [x] Test invalid input, oversized input, database errors, and repeated submissions.

## Phase 4 — Connect the existing Contact form

- [x] Connect the existing form to the configured API URL.
- [x] Prevent duplicate submission while loading.
- [x] Add accessible validation, loading, success, and failure states.
- [x] Retain entered values when submission fails where practical.
- [x] Confirm success appears only after the database write succeeds.
- [x] Test on desktop and mobile without breaking existing styling.

## Phase 5 — Admin authentication and protected APIs

- [x] Choose a secure, maintainable admin authentication/session approach.
- [x] Create the initial admin credential securely; do not commit credentials.
- [x] Implement `POST /api/admin/login`, `POST /api/admin/logout`, and `GET /api/admin/me`.
- [x] Add login rate limiting and secure cookie/session settings.
- [x] Implement server-side auth middleware.
- [x] Implement protected `GET /api/admin/leads` with bounded results and filters.
- [x] Implement protected `GET /api/admin/leads/:id`.
- [x] Implement protected `PATCH /api/admin/leads/:id` for allowed status changes.
- [x] Implement protected `DELETE /api/admin/leads/:id`.
- [x] Verify every admin API rejects unauthenticated requests.

## Phase 6 — Connect the existing Admin page

- [x] Replace placeholder/empty dashboard content with real API data.
- [x] Add total, new, contacted, qualified, and closed counts.
- [x] Add a leads table with name, email, subject, date, status, and details action.
- [x] Add lead detail view with the full message and a mailto reply link.
- [x] Add status update control.
- [x] Add delete confirmation and success/error feedback.
- [x] Add a useful empty state and loading/error states.
- [x] Add search/status filters if time permits.
- [x] Ensure the route is protected in the UI as well as on the server.

## Phase 7 — Quality and security checks

- [x] Test all API endpoints with valid and invalid requests.
- [x] Test SQL parameterization and invalid UUID handling.
- [x] Test CORS using the actual frontend origin.
- [x] Test rate limits and authentication failure behavior.
- [x] Confirm no stack traces, SQL errors, or secrets reach public responses.
- [x] Run frontend build and backend tests.
- [x] Check navigation, contact submission, admin flows, and responsive layout.
- [ ] Run PageSpeed Insights for mobile and desktop and capture screenshots.

## Phase 8 — Deployment and submission

- [ ] Deploy the backend and configure production environment variables.
- [ ] Configure production database URL and frontend origin.
- [ ] Deploy the frontend with the correct public API base URL.
- [ ] Verify live contact submission persists in Neon.
- [ ] Verify live admin login and lead management.
- [ ] Write setup, environment, migration, API, deployment, and India-specific design rationale in README.
- [ ] Ensure the repository is public and contains no secrets.
- [ ] Prepare demo admin access through the agreed secure submission method.
- [ ] Prepare live URL, GitHub URL, PageSpeed screenshots, and optional walkthrough.

## MVP exclusions — do not add during the first pass

- [ ] Do not add Nodemailer/email notifications.
- [ ] Do not add visitor signup, OTP, or password reset.
- [ ] Do not add WebSockets, Redis, queues, or microservices.
- [ ] Do not add a service wizard, uploads, budget, timeline, phone, or company fields unless explicitly approved.
