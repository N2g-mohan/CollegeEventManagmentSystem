# College Event Management System - Project Information

## 1. Project ke baare mein

College Event Management System ek full-stack web application hai. Iska main purpose college ke events ko manual register aur notice board system ki jagah online manage karna hai.

Is application mein do main users hain:

1. **Student:** Events dekhna, search/filter karna, register/cancel karna.
2. **Admin:** Events add/edit/delete karna aur registrations manage karna.

Project ko simple aur understandable rakha gaya hai, isliye viva ke time har module ka flow clearly explain kiya ja sakta hai.

## 2. Used Technologies

| Part | Technology | Kaha use hua |
|---|---|---|
| Frontend | React 19 | UI components aur pages |
| Routing | React Router DOM 7 | Page navigation |
| Styling | CSS | `frontend/src/index.css` |
| Frontend build tool | Vite 8 | React development server aur build |
| Backend | Java 21 | Server-side language |
| Backend framework | Spring Boot 3.3.5 | REST APIs aur application setup |
| ORM | Spring Data JPA/Hibernate | Java entities ko database tables se map karna |
| Database | MySQL | Permanent data storage |
| Build tool | Maven | Java dependencies aur backend build |
| Password security | BCrypt | Password ko hashed form mein save karna |

## 3. Folder-wise Information

```text
collegeEventManagement/
├── backend/
├── frontend/
├── database_setup.sql
├── README.md
├── PROJECT_INFORMATION.md
└── .gitignore
```

### Backend folder

`backend/pom.xml` mein Spring Boot, JPA, MySQL, BCrypt aur testing dependencies hain.

Main package: `backend/src/main/java/com/college/eventmanagement/`

| File ya folder | Kaam |
|---|---|
| `CollegeEventManagementApplication.java` | Spring Boot application ka main entry point |
| `config/CorsConfig.java` | Frontend aur backend cross-origin configuration |
| `config/DataInitializer.java` | Startup par default admin aur sample events create karta hai |
| `controller/AuthController.java` | Signup, login aur logout APIs |
| `controller/EventController.java` | Event create, read, update aur delete APIs |
| `controller/RegistrationController.java` | Student registration, cancellation aur registered students APIs |
| `entity/User.java` | User/admin table ka Java model |
| `entity/Event.java` | Event table aur seat/helper fields ka model |
| `entity/Registration.java` | Student-event relation ka model |
| `repository/*.java` | JPA repository interfaces jo database queries handle karti hain |
| `util/PasswordUtil.java` | Password hash aur verification |
| `application.properties` | Server port, database connection aur JPA settings |

### Frontend folder

`frontend/src/App.jsx` application ka main route control karta hai aur logged-in user ko `sessionStorage` mein temporarily rakhta hai.

`frontend/src/components/Navbar.jsx` logged-in role ke according navigation links dikhata hai.

| Page | Kaam |
|---|---|
| `Home.jsx` | Project ka public landing page |
| `Login.jsx` | Student/admin login form |
| `Signup.jsx` | New student account registration |
| `StudentDashboard.jsx` | Events dekhna, search aur category filter karna |
| `EventDetails.jsx` | Event details aur participate/cancel action |
| `MyEvents.jsx` | Student ki registered events aur cancel option |
| `AdminDashboard.jsx` | All events, summary aur admin actions |
| `AddEvent.jsx` | Naya event create karna |
| `EditEvent.jsx` | Existing event update karna |
| `RegisteredStudents.jsx` | Kisi event ke registered students aur remove action |

`frontend/vite.config.js` mein `/api` ke liye proxy configured hai, jo frontend request ko `http://localhost:8080` backend par bhejta hai.

## 4. Database Structure

Database ka naam `college_event_management_db` hai.

### users table

| Column | Description |
|---|---|
| id | Unique user id |
| full_name | User ka naam |
| email | Login email, unique hai |
| password | BCrypt hashed password |
| college_roll_number | Student roll number ya admin code |
| department | Department |
| academic_year | Student year ya Staff |
| role | `STUDENT` ya `ADMIN` |

### events table

| Column | Description |
|---|---|
| id | Unique event id |
| event_name | Event ka naam |
| event_description | Event ki details |
| event_date | Event hone ki date |
| event_time | Event ka time |
| event_venue | Location |
| event_category | Technical, Workshop, Cultural, Sports ya Seminar |
| total_seats | Total available capacity |
| registration_last_date | Registration deadline |
| charge | Entry fee, 0 means free |

### registrations table

| Column | Description |
|---|---|
| id | Unique registration id |
| user_id | Student ka id |
| event_id | Event ka id |
| registration_date | Registration ka date aur time |
| status | Default `CONFIRMED` |

Relations:

- Ek student multiple events ke liye register ho sakta hai.
- Ek event mein multiple students register ho sakte hain.
- `registrations` table ke through many-to-many relationship complete hoti hai.
- Foreign key delete cascade hai: student ya event delete hone par uski registrations bhi delete ho sakti hain.

## 5. Backend REST APIs

### Authentication APIs

| Method | API | Working |
|---|---|---|
| POST | `/api/auth/signup` | Student signup |
| POST | `/api/auth/login` | Email/password verification |
| POST | `/api/auth/logout` | Backend HTTP session invalidate |

### Event APIs

| Method | API | Working |
|---|---|---|
| GET | `/api/events` | Sab events aur seat/registration information |
| GET | `/api/events/{id}` | Single event detail |
| POST | `/api/events` | Naya event create |
| PUT | `/api/events/{id}` | Event update |
| DELETE | `/api/events/{id}` | Event delete |

### Registration APIs

| Method | API | Working |
|---|---|---|
| GET | `/api/registrations/student/{userId}` | Student ki registrations |
| GET | `/api/registrations/event/{eventId}` | Event ke registered students |
| POST | `/api/registrations` | Student ko event mein register karna |
| DELETE | `/api/registrations?userId={id}&eventId={id}` | Student apni registration cancel kare |
| DELETE | `/api/registrations/{id}` | Admin registration by id remove kare |

## 6. Main Working Flow

### Signup flow

1. Student Signup page kholta hai.
2. Details fill karta hai aur password confirm karta hai.
3. Password minimum 6 characters hona chahiye.
4. Frontend `/api/auth/signup` ko data bhejta hai.
5. Backend email duplicate check karta hai.
6. Password BCrypt se hash hota hai.
7. User role `STUDENT` set hota hai.
8. Data MySQL `users` table mein save hota hai.

### Login flow

1. Student/admin login page par email aur password enter karta hai.
2. Frontend `/api/auth/login` ko POST request karta hai.
3. Backend email se user dhundta hai.
4. BCrypt se password verify hota hai.
5. Login successful hone par user object frontend ko milta hai.
6. User ka basic data `sessionStorage` mein save hota hai.
7. Admin ko admin dashboard aur student ko student dashboard par bheja jata hai.

### Event registration flow

1. Student available events list kholta hai.
2. Event details open karta hai ya direct Participate button dabata hai.
3. Backend duplicate registration check karta hai.
4. Registration last date check hoti hai.
5. Available seat count check hoti hai.
6. Sab conditions pass hone par `registrations` table mein record create hota hai.
7. Event fee free hai to free message milta hai.
8. Fee paid hai to offline payment ka message milta hai.

Yahan payment gateway implement nahi hai. Charge sirf event fee information ke liye hai aur payment venue desk par offline mana gaya hai.

### Admin event flow

1. Admin login karta hai.
2. Admin dashboard se events ki list aur summary statistics dekhta hai.
3. Add Event se event details fill karke save karta hai.
4. Edit Event se existing data update karta hai.
5. Delete Event se event aur uski registrations remove ho sakti hain.
6. Students button se event ke saare registered students dekh aur remove kar sakta hai.

## 7. Starting Steps

### Step 1: Database

MySQL start karein aur `database_setup.sql` run karein.

```sql
CREATE DATABASE IF NOT EXISTS college_event_management_db;
```

### Step 2: Backend configuration

`backend/src/main/resources/application.properties` mein MySQL settings set karein:

```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/college_event_management_db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.jpa.hibernate.ddl-auto=update
```

Production use mein database password ko source code se alag environment/configuration mein rakhna better hai.

### Step 3: Backend run

Terminal 1:

```powershell
cd D:\collegeEventManagement\backend
mvn spring-boot:run
```

Backend ready hone par `http://localhost:8080` par listening state mein rehta hai.

### Step 4: Frontend dependencies

Terminal 2:

```powershell
cd D:\collegeEventManagement\frontend
npm install
npm run dev
```

Browser mein `http://localhost:5173` open karein.

## 8. Default Account aur Sample Data

Backend first startup par:

- `admin@college.edu` admin account ensure/create karta hai
- Agar event table empty hai to 3 sample events create karta hai
- Existing admin ka password validate/update kar sakta hai

Demo admin credentials:

- Email: `admin@college.edu`
- Password: `admin123`

Naya student signup page se banaya ja sakta hai. README/demo hint mein purana rahul demo account mention tha, lekin us account ko backend startup automatic create nahi karta. Viva ke time ye clear rehna useful hai.

## 9. Seat aur Deadline Logic

Event ke liye seat check backend aur frontend dono levels par dikhaya gaya hai:

- `registeredCount =` us event ki registration count
- `availableSeats = totalSeats - registeredCount`
- `isSeatFull = registeredCount >= totalSeats`
- `isRegistrationClosed = aaj ki date registrationLastDate se baad hai`

Deadline ya seats full hone par participation blocked hota hai.

Duplicate registration ko backend duplicate check se stop karta hai.

## 10. Security aur Limitations

- Password plain text mein store nahi hota; BCrypt hash use hota hai.
- Session user information browser ke `sessionStorage` mein rakhi jaati hai.
- Backend login session bhi use karta hai, lekin kai protected APIs abhi direct role-based authorization middleware se fully protect nahi hain.
- Frontend route guards basic role check dikhate hain.
- Database password local configuration mein hai, isliye code/public repository mein personal password share nahi karni chahiye.
- Payment gateway available nahi hai; entry fee sirf information aur offline payment note hai.
- Password reset, email verification aur online payment is project ki current scope mein nahi hain.

Viva mein is limitation ko openly aur professionally explain kiya ja sakta hai.

## 11. Viva ke liye Common Questions

**Q: MVC architecture kya hai?**  
Frontend React pages View ki tarah hain; Spring Controller request handle karte hain; Entity data model hain; Repository database operations karti hai.

**Q: REST API kya hoti hai?**  
REST API HTTP methods jaise GET, POST, PUT aur DELETE ke through backend data exchange karti hai. Is project mein JSON use hota hai.

**Q: JPA kya hai?**  
Java Persistence API Java objects aur database tables ke beech mapping provide karti hai. Hibernate implementation use hota hai.

**Q: Spring Boot ka role kya hai?**  
Ye application server, REST endpoints, dependency injection, database integration aur starter configurations provide karta hai.

**Q: React ka role kya hai?**  
React UI components aur state ke basis par dynamic pages render karta hai. Fetch API se backend ko call karta hai.

**Q: CORS aur proxy kya hai?**  
Frontend aur backend different ports par hain. Vite proxy `/api` requests ko backend par bhejta hai aur backend mein CORS configuration bhi present hai.

**Q: BCrypt kyun use hua?**  
Password ko reversible plain text ke bajay irreversible hashed format mein store karne ke liye.

**Q: Foreign key kyun use hui?**  
Registrations ko valid student aur valid event se link karne ke liye.

**Q: `sessionStorage` aur backend session mein kya difference hai?**  
`sessionStorage` browser tab mein temporary user UI data rakhta hai. Backend `HttpSession` logout ke time login session ko invalidate karta hai.

**Q: Event delete hone par kya hota hai?**  
Database foreign key cascade ke according us event ki registrations delete ho sakti hain.

**Q: Naya event kaise add hota hai?**  
Admin Add Event form fill karta hai, frontend POST `/api/events` call karta hai aur `EventController` data JPA repository se save karta hai.

**Q: Student ek hi event ke liye duplicate register ho sakta hai?**  
Nahi. Backend `existsByUserIdAndEventId` se duplicate check karta hai.

**Q: Seat full check kaha hota hai?**  
Frontend display ke liye available/seat full status calculate karta hai aur backend registration ke time bhi count check karta hai.

**Q: Deadline check kaha hota hai?**  
Registration ke time `LocalDate.now()` ko event ki `registrationLastDate` se compare kiya jata hai.
