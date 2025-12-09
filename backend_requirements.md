# Backend Requirements for K12 Tutoring Platform

This document outlines the API endpoints, database schema, and logic required to support the current Frontend implementation.

## 1. Database Schema

### Users Table
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `role`: Enum ('parent', 'student', 'tutor', 'admin')
- `first_name`: String
- `last_name`: String
- `created_at`: timestamp

### Students Table
- `id`: UUID (Primary Key)
- `parent_id`: UUID (Foreign Key -> Users.id)
- `first_name`: String
- `last_name`: String
- `grade`: String (e.g., "5", "10")
- `school`: String
- `curriculum_preference`: String (Foreign Key/Enum -> Curricula.id, nullable)
- `created_at`: timestamp

### Subjects Table
- `id`: String (Primary Key, e.g., 'math')
- `name`: String (e.g., 'Mathematics')

### Curricula Table
- `id`: String (Primary Key, e.g., 'ngss')
- `name`: String (e.g., 'NGSS')

### Packages Table
- `id`: String (Primary Key)
- `name`: String
- `price_cents`: Integer
- `currency`: String (default 'USD')

### Bookings Table
- `id`: UUID (Primary Key)
- `parent_id`: UUID (Foreign Key -> Users.id)
- `student_id`: UUID (Foreign Key -> Students.id)
- `subject_id`: String (Foreign Key -> Subjects.id)
- `curriculum_id`: String (Foreign Key -> Curricula.id)
- `package_id`: String (Foreign Key -> Packages.id)
- `status`: Enum ('scheduled', 'completed', 'cancelled')
- `start_time`: Timestamp (UTC)
- `end_time`: Timestamp (UTC)
- `note`: Text (nullable)
- `created_at`: timestamp

---

## 2. API Endpoints

### Authentication
- `POST /auth/login`: Returns `{ token, user: { ... } }`
- `POST /auth/register`: Creates new user.

### Students
- `POST /students`:
    - **Header**: `Authorization: Bearer <parent_token>`
    - **Body**: `{ first_name, last_name, grade, school, curriculum_preference }`
    - **Logic**: Create a student linked to the authenticated parent.
- `GET /students/parent`:
    - **Header**: `Authorization: Bearer <parent_token>`
    - **Response**: Array of Student objects linked to the parent.
- `DELETE /students/:id`:
    - **Logic**: Delete student (soft delete prefered).

### Catalog (Metadata)
- `GET /subjects`: Returns list of all subjects.
- `GET /curricula`: Returns list of all curricula.
- `GET /packages`: Returns list of available packages.

### Bookings
- `POST /bookings/create`:
    - **Header**: `Authorization: Bearer <parent_token>`
    - **Body**: 
      ```json
      {
        "student_id": "...",
        "subject_id": "...",
        "curriculum_id": "...",
        "package_id": "...",
        "requested_start": "ISO-8601 string",
        "requested_end": "ISO-8601 string",
        "note": "..."
      }
      ```
    - **Logic**: Create booking record. Validate IDs exist.
- `GET /bookings/parent`:
    - **Header**: `Authorization: Bearer <parent_token>`
    - **Response**: List of bookings for the parent (optionally filter by `upcoming`).

---

## 3. Critical Implementation Notes
- **CORS**: Ensure backend permits requests from the frontend domain (localhost:3000/3001).
- **ID Validation**: The frontend sends string IDs for subjects/curricula (`math`, `ngss`). Ensure these are seeded in the DB or the constraints allow them.
- **Date Handling**: Frontend sends ISO strings (UTC). Backend should store as UTC timestamps.
