# Database Design

## Tables

- `USERS`: student/admin accounts
- `EVENTS`: tech fest event catalog
- `REGISTRATIONS`: user-to-event registrations

## Key Rules

- `USERS.EMAIL` must be unique.
- `REGISTRATIONS` has unique constraint on `(USER_ID, EVENT_ID)`.
- `EVENTS.STATUS` must be one of `OPEN`, `CLOSED`, `COMPLETED`.
- `REGISTRATIONS.STATUS` must be one of `CONFIRMED`, `CANCELLED`.

## Operational Notes

- Passwords are stored as hashes only.
- Capacity/deadline checks are enforced in backend registration flow.
- Use transactions for event registration to reduce race conditions.
