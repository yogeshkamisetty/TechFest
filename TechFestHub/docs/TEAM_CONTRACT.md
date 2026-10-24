# Team Contract

## Ownership

- Frontend owns: `WebContent/index.html`, `WebContent/css/style.css`, `WebContent/js/main.js`, public JSP pages.
- Student backend owns: `DBConnection`, `User`, `Registration`, `UserDAO`, `RegistrationDAO`, auth/registration servlets.
- Admin module owns: `Event`, `EventDAO`, admin/event servlets, admin JSP pages, schema/sample data.

## Shared Contracts

- Fixed package root: `com.techfest`.
- Fixed URLs and form field names from the project brief.
- Shared session keys: `userId`, `userName`, `userRole`.
- Shared request attributes: `events`, `event`, `registrations`, `message`.

## Integration Rules

- One integrator merges shared config changes (`web.xml`, shared docs).
- No credentials in source control.
- Run test checklist after each merge.
