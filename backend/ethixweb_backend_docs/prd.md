# EthixWeb India — Backend Product Requirements Document (PRD)

## 1. Purpose

Build a small, production-minded backend for the EthixWeb India website assessment. It must persist website enquiries in Neon PostgreSQL and let an authenticated administrator review and manage those enquiries through the existing Admin page.

## 2. Assessment outcomes

The delivered system must provide:
- A working Contact/Enquiry form connected to a real database.
- Server-side validation and useful, consistent API errors.
- Basic anti-spam protection.
- A protected `/admin` experience backed by protected server APIs.
- Secure handling of secrets through environment variables.
- A maintainable backend in a separate `backend/` directory.
- Setup, deployment, and India-specific design rationale documented in the README.

Assessment submission also expects a live URL, public GitHub repository, PageSpeed Insights screenshots for mobile and desktop, demo admin login details, and optionally a short walkthrough.

## 3. Existing frontend contract

Preserve the existing frontend, navigation, sections, animations, and design. Connect the current Contact form; do not create a competing form.

The existing form fields are:
- `name`
- `email`
- `projectSubject`
- `message`

The API/database may use `project_subject` for the subject field. Do not add phone, company, service selector, budget, timeline, file upload, or visitor account fields unless the existing UI already collects them or the product owner explicitly approves the change.

## 4. MVP user stories

### Visitor
- As a visitor, I can submit my name, email, project subject, and message.
- I receive a clear success message only after the server confirms the enquiry was saved.
- I see actionable validation or failure feedback if submission fails.
- My form does not submit repeatedly while a request is in progress.

### Administrator
- As an administrator, I can sign in securely.
- I can see a count of total, new, contacted, qualified, and closed leads.
- I can view a list of enquiries and open a lead to read the full message.
- I can update a lead's status.
- I can delete a lead after an explicit confirmation.
- I can search/filter leads if time permits.
- I see a useful empty state when no enquiries exist.

## 5. Functional requirements

1. `POST /api/leads` validates and stores a new enquiry.
2. Admin authentication is verified by the server, not merely by hiding a frontend route.
3. `GET /api/admin/leads` returns a paginated or bounded list of leads to authenticated admins.
4. `GET /api/admin/leads/:id` returns one lead to an authenticated admin.
5. `PATCH /api/admin/leads/:id` updates only allowed fields, initially `status`.
6. `DELETE /api/admin/leads/:id` deletes a lead only for an authenticated admin.
7. A health endpoint reports whether the API is running; it must not leak secrets.
8. Responses use a consistent JSON shape and appropriate HTTP status codes.

## 6. Lead status lifecycle

Allowed statuses:
- `new` — received, not yet handled.
- `contacted` — the team has contacted the lead.
- `qualified` — the enquiry is a relevant opportunity.
- `closed` — no further action is planned.

New enquiries default to `new`.

## 7. Non-functional requirements

- Responsive, accessible form and admin states.
- Parameterized SQL; no SQL built by concatenating user input.
- Server-side validation even if the browser also validates.
- Rate limiting and a honeypot or similarly lightweight anti-spam measure.
- Secure admin session/cookie configuration for the deployment environment.
- No secrets committed to source control or exposed to client-side bundles.
- No fabricated production leads or demo credentials committed to the repository.
- Keep implementation understandable and achievable within the 24-hour assessment.

## 8. Explicitly out of scope for MVP

- Nodemailer or email notifications.
- Visitor registration, OTP, or password reset flows.
- WebSockets or real-time push notifications.
- Redis, queues, microservices, or a separate analytics system.
- Multi-step service-selection wizard.
- Uploads, attachments, or CRM integrations.

A new enquiry appearing after refreshing/reloading the admin list is sufficient for the MVP.

## 9. Acceptance criteria

- [ ] A valid enquiry appears in Neon PostgreSQL.
- [ ] Invalid or oversized inputs are rejected by the API.
- [ ] Repeated rapid submissions are rate-limited.
- [ ] API errors do not reveal stack traces, credentials, or SQL details.
- [ ] Unauthenticated requests to every admin API are rejected.
- [ ] Admin can list, inspect, update status, and delete leads.
- [ ] Empty dashboard state and zero counts work without seed data.
- [ ] Contact form loading, success, and failure states work.
- [ ] `.env` is ignored by Git and `.env.example` contains placeholders only.
- [ ] README includes setup instructions and deployment/configuration details.
- [ ] Frontend routes, navbar links, and existing animations remain intact.
