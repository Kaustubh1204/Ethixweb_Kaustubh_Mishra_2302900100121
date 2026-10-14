# EthixWeb India — Design Specification

## 1. Design objective

Extend the existing EthixWeb India website with a reliable enquiry workflow and a usable admin experience. The backend should support the current design rather than trigger an unnecessary redesign. Prioritize clear feedback, responsive layouts, accessibility, and working behavior over decorative complexity.

## 2. Preserve the existing website

- Keep the current visual identity, logo, typography, colors, spacing, navigation, section order, and established animations.
- Do not replace existing page sections or create a second Contact form.
- Integrate the backend with the current Contact page fields: Name, Email, Project Subject, and Your Message.
- Keep all existing navbar links and page routes working.
- Make only the changes required to submit the form and display API-backed admin data.
- Do not introduce new visible form fields without explicit approval.

## 3. Contact form interaction states

The existing form must support the following states:

1. **Ready:** fields are editable and the submit action is clear.
2. **Validation error:** identify missing/invalid fields in plain language and associate messages with the relevant inputs.
3. **Submitting:** show progress and prevent repeated clicks/submissions.
4. **Success:** show confirmation only after the backend confirms the database write.
5. **Failure:** show a helpful retry message; retain the user's input where practical.

Accessibility requirements:
- Every field has a programmatic label.
- Errors are readable and not communicated by color alone.
- Keyboard focus remains visible.
- Submission feedback is announced appropriately to assistive technology.
- Inputs and controls remain usable on narrow mobile screens.

## 4. Admin dashboard information architecture

Use the existing Admin page and project design system. Do not create a separate app unless the current architecture requires it.

### Overview metrics

Display real counts for:
- Total enquiries
- New
- Contacted
- Qualified
- Closed

Counts must come from the API/database, not hardcoded sample values.

### Enquiry list

Recommended columns:
- Name
- Email
- Project subject
- Submitted date
- Status
- View/details action

Use readable dates and clear status labels. Provide search/status filtering if it fits the assessment schedule.

### Enquiry detail

Show:
- Name
- Email with a mailto link
- Project subject
- Full message
- Submission timestamp
- Current status
- Status update control
- Delete action with explicit confirmation

Avoid showing unnecessary personal data or internal implementation details.

## 5. Admin visual states

- **Loading:** show a restrained loading indicator or skeleton.
- **Empty:** explain that no enquiries have been received yet; do not seed fake production records.
- **Error:** show a clear message and a retry action where appropriate.
- **Success:** confirm status changes and deletions.
- **Unauthorized/session expired:** direct the administrator to sign in again without exposing protected data.

## 6. India-specific experience

The assessment targets Indian businesses. Make the experience practical and trustworthy for that audience:
- Use direct, professional English consistent with the current website.
- Keep contact submission fast and mobile-friendly, including on slower connections.
- Avoid unnecessary account creation, OTP, or multi-step friction for an enquiry.
- Display dates consistently and configure the presentation timezone intentionally; keep stored timestamps as `TIMESTAMPTZ`.
- Do not assume or add currency, regional-language, or phone-number fields when the current form does not collect them.
- Explain India-specific design decisions in the project README, grounded in actual implemented choices rather than generic claims.

## 7. Responsive behavior

- At mobile widths, stack metric cards and allow the lead list to remain readable.
- If the table cannot fit, use a responsive horizontal scroller or a compact card/list layout.
- Keep action controls comfortably tappable.
- Prevent long email addresses and message text from breaking the layout.
- Verify both public form and admin flows on desktop and mobile.

## 8. Visual and interaction constraints

- Keep animation lightweight and avoid adding motion that interferes with form submission or dashboard use.
- Respect the existing motion system; support reduced-motion preferences where practical.
- Do not show a success state before the API response.
- Do not expose private leads to unauthenticated visitors.
- Do not rely on frontend route hiding as the sole admin security control.
- Keep destructive actions explicit and recoverable from user mistakes where feasible.

## 9. Design acceptance checklist

- [ ] Existing visual identity and page structure remain intact.
- [ ] Contact form has ready, validation, loading, success, and failure states.
- [ ] Admin overview shows live counts.
- [ ] Lead list and detail view are readable and responsive.
- [ ] Status update and delete actions provide clear feedback.
- [ ] Empty, loading, error, and expired-session states are handled.
- [ ] Keyboard focus and field labels are accessible.
- [ ] No fake production leads or hardcoded metrics are shown.
- [ ] Desktop and mobile layouts have been checked.
