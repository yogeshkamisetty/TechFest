# TechFest Hub

**TechFest Hub** is a web-based **Technical Fest Event Management System** developed using Java web technologies. It provides a centralized platform for students to explore technical events, register for events, manage their registrations, and for administrators to manage events and participants.

## 🚀 Features

### 👨‍🎓 Student Features

- Student account registration and login
- Browse available technical events
- View detailed event information
- Search and explore events
- Register for events
- Solo and team registration
- Select event tracks
- Simulated payment flow
- View registered events
- Cancel registrations
- Secure session-based authentication

### 🛠️ Admin Features

- Admin authentication
- Admin dashboard
- Create and update events
- Open or close event registrations
- View event registrations
- Manage event status
- Monitor participants and registration details

### 📅 Event Management

Each event can contain:

- Event name
- Category
- Description
- Date and time
- Venue
- Registration fee
- Maximum participants
- Registration deadline
- Event status
- Coordinator details

## 🧑‍💻 Technology Stack

| Technology | Usage |
|---|---|
| **Java** | Backend programming |
| **Java Servlets** | Request handling and application logic |
| **JSP** | Dynamic web pages |
| **HTML** | Page structure |
| **CSS** | User interface styling |
| **JavaScript** | Client-side interactions |
| **JDBC** | Database connectivity |
| **Oracle XE** | Database |
| **Maven** | Project and dependency management |
| **Apache Tomcat 9** | Web server |
| **Eclipse IDE** | Development environment |

## 🏗️ Architecture

The application follows a simple layered Java web application structure:

```text
Browser
   ↓
JSP / HTML / CSS / JavaScript
   ↓
Java Servlets
   ↓
DAO Layer
   ↓
JDBC
   ↓
Oracle Database
```

### Main Backend Components

- `LoginServlet` – Handles user authentication
- `SignupServlet` – Handles student registration
- `LogoutServlet` – Handles logout
- `EventServlet` – Retrieves and displays events
- `EventDetailsServlet` – Displays event details
- `RegistrationServlet` – Handles event registrations
- `MyRegistrationsServlet` – Displays student registrations
- `AdminDashboardServlet` – Handles admin dashboard operations
- `AdminEventServlet` – Creates, updates and manages events
- `AdminRegistrationsServlet` – Manages registration information
- `AuthenticationFilter` – Controls authenticated access
- `DBConnection` – Establishes Oracle database connectivity

## 📂 Project Structure

```text
TechFestHub/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── techfest/
│       │           ├── Servlets
│       │           ├── DAO Classes
│       │           ├── Model Classes
│       │           ├── DBConnection.java
│       │           └── AuthenticationFilter.java
│       │
│       └── webapp/
│           ├── admin/
│           ├── css/
│           ├── js/
│           ├── images/
│           ├── index.jsp
│           ├── events.jsp
│           ├── event-details.jsp
│           ├── login.html
│           ├── signup.html
│           ├── register.jsp
│           ├── payment.jsp
│           ├── my-registrations.jsp
│           ├── user-home.jsp
│           └── WEB-INF/
│               └── web.xml
│
├── database/
│   ├── schema.sql
│   └── sample-data.sql
│
├── pom.xml
└── README.md
```

## 🗄️ Database

The application uses **Oracle XE** with JDBC.

### Main Tables

#### USERS

Stores user account information.

```text
USER_ID
FULL_NAME
EMAIL
PASSWORD_HASH
ROLE
DEPARTMENT
CREATED_AT
```

#### EVENTS

Stores technical event information.

```text
EVENT_ID
SLUG
EVENT_NAME
CATEGORY
DESCRIPTION
EVENT_DATE
VENUE
REGISTRATION_FEE
MAX_PARTICIPANTS
REGISTRATION_DEADLINE
STATUS
```

#### REGISTRATIONS

Stores student event registrations.

```text
REGISTRATION_ID
REG_NUMBER
USER_ID
EVENT_ID
TEAM_NAME
TRACK_SELECTED
REGISTERED_AT
STATUS
```

The database also uses **sequences and triggers** for generating IDs and registration numbers.

## ⚙️ Setup

### Prerequisites

Install the following:

- JDK 21
- Eclipse IDE
- Apache Tomcat 9
- Oracle Database XE
- Maven

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TechFestHub_Simplified
```

### 2. Import into Eclipse

In Eclipse:

```text
File
→ Import
→ Maven
→ Existing Maven Projects
```

Select the project folder containing `pom.xml`.

### 3. Configure Oracle Database

Create the required database objects by executing:

```text
database/schema.sql
```

Then insert sample data using:

```text
database/sample-data.sql
```

### 4. Configure Database Connection

The application currently uses an Oracle XE JDBC connection:

```text
jdbc:oracle:thin:@localhost:1521:xe
```

Database credentials can be configured in:

```text
DBConnection.java
```

Update the username and password according to your local Oracle setup.

> **Important:** Do not commit real database credentials or passwords to a public repository.

### 5. Configure Tomcat

Add **Apache Tomcat 9** to Eclipse and add the project to the server.

Then run:

```text
Right-click Project
→ Run As
→ Run on Server
```

### 6. Open the Application

After Tomcat starts, open:

```text
http://localhost:8080/TechFestHub_Simplified/
```

The exact URL may vary depending on the configured Tomcat context root.

## 🔐 User Roles

| Role | Access |
|---|---|
| **Student** | Browse events, register, manage registrations |
| **Admin** | Manage events and view registrations |

## 🔄 Application Flow

```text
User
 │
 ├── Sign Up
 │      ↓
 │   Login
 │      ↓
 │   Browse Events
 │      ↓
 │   View Event Details
 │      ↓
 │   Register
 │      ↓
 │   Payment Simulation
 │      ↓
 │   Registration Confirmed
 │      ↓
 │   My Registrations
 │
 └── Admin
        ↓
     Admin Login
        ↓
     Dashboard
        ↓
     Manage Events
        ↓
     View Registrations
```

## 📌 Project Highlights

- Role-based access for students and administrators
- Oracle database integration using JDBC
- Servlet-based backend architecture
- DAO-based database operations
- Event creation and management
- Student and team registrations
- Registration tracking and cancellation
- Session-based authentication
- Maven-based project configuration
- Responsive web interface using HTML, CSS and JavaScript

## 🔮 Future Enhancements

- Real online payment gateway integration
- Email notifications for registrations
- QR-code based event check-in
- Automated participation certificates
- Advanced admin analytics
- Event attendance tracking
- Password reset through email

## 👥 Project

**TechFest Hub — Technical Fest Event Management System**

Developed using **Java Servlets, JSP, JDBC, Oracle Database, HTML, CSS, JavaScript, Maven, and Apache Tomcat**.
