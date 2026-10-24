# Tech Fest Hub

Tech Fest Hub is a Java Servlet + JSP web application for discovering technical events,
student registrations, and admin event management.

## Stack

- Frontend: HTML5, CSS3, JavaScript, JSP
- Backend: Java Servlets, JDBC
- Database: Oracle Database
- Server: Apache Tomcat

## Project Structure

The repository uses Eclipse-compatible physical folders:

- `src/com/techfest/...`
- `WebContent/...`
- `database/...`
- `docs/...`

## Environment Variables

Set these before running on Tomcat:

- `TECHFEST_DB_URL` (example: `jdbc:oracle:thin:@//HOST:PORT/SERVICE_NAME`)
- `TECHFEST_DB_USER`
- `TECHFEST_DB_PASSWORD`

## Quick Start

1. Create Oracle tables by running `database/schema.sql`.
2. Add sample records from `database/sample-data.sql`.
3. Configure Oracle JDBC driver in your server/project.
4. Deploy to Tomcat with context path `TechFestHub`.
5. Open `/TechFestHub/events`.

## Core Routes

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
