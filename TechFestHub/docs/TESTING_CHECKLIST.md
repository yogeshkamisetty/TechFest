# Testing Checklist

## Student Flow

- Signup succeeds with valid input.
- Duplicate email is rejected.
- Invalid login is rejected.
- Valid login sets session attributes.
- Logout invalidates session.
- Events list and details load from Oracle.
- Logged-in student can register for open event.
- Duplicate registration is rejected.
- My registrations only shows logged-in user's records.

## Admin Flow

- Admin login works.
- Non-admin cannot access admin routes.
- Admin can create and update events.
- Admin can close/delete events.
- Closed/completed events reject registrations.
- Admin registrations view loads all rows.
- Dashboard counts are consistent.

## Integration

- Servlet URLs match contract.
- Form field names match servlet parameters.
- Request/session attributes use agreed names.
- Schema and sample data execute without errors.
- No credentials committed.
