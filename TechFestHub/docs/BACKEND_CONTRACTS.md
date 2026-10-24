# Backend Contracts

## Model Fields

- `User`: `userId`, `fullName`, `email`, `passwordHash`, `role`, `department`
- `Event`: `eventId`, `eventName`, `category`, `description`, `eventDate`, `venue`, `registrationFee`, `maxParticipants`, `registrationDeadline`, `status`
- `Registration`: `registrationId`, `userId`, `eventId`, `registeredAt`, `status`

## DAO Responsibilities

- `UserDAO`: `createUser(...)`, `findByEmail(...)`
- `EventDAO`: `getAllEvents()`, `getEventById(...)`, `createEvent(...)`, `updateEvent(...)`, `deleteEvent(...)`
- `RegistrationDAO`: `registerStudent(...)`, `getRegistrationsByUserId(...)`, `getAllRegistrations()`, `getRegistrationCountsByEvent()`

## Servlet Routes

- `GET /events`
- `GET /event-details`
- `POST /signup`
- `POST /login`
- `POST /logout`
- `POST /event-register`
- `GET /my-registrations`
- `GET /admin/dashboard`
- `POST /admin/event/create`
- `POST /admin/event/update`
- `POST /admin/event/delete`
- `GET /admin/registrations`
