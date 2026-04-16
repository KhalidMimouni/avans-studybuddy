# StudyBuddy Technical Architecture

## Stack
- Monorepo: Nx
- Frontend: Angular standalone application
- Styling: Tailwind CSS
- Backend: NestJS
- Database: SQLite
- ORM: Prisma
- Authentication: JWT-based auth with password hashing
- Testing: Jest for backend unit tests and Angular tests where useful

## Apps
### studybuddy-web
Responsibilities:
- SPA frontend
- routing
- forms and validation
- authenticated UI
- overview and detail pages
- About page

### studybuddy-api
Responsibilities:
- REST API
- authentication and authorization
- Prisma data access
- DTO validation
- business rules
- seed support

## Database decision
Use SQLite as the main SQL database for the project.

## Backend module structure
Create separate NestJS modules for:
- auth
- users
- courses
- study-groups
- study-sessions
- enrollments

## Frontend feature structure
Use feature-first organization where practical:
- auth
- courses
- study-groups
- study-sessions
- profile
- about
- shared UI

## API conventions
- use REST endpoints
- use plural resource names
- validate request DTOs on the backend
- never trust client-side authorization alone
- enforce owner-based rules on the backend

## Auth conventions
- register and login endpoints return secure auth responses
- hash passwords with bcrypt or bcryptjs
- use JWT access tokens
- protect mutation endpoints with auth guards
- verify ownership on update and delete actions

## Data and seed conventions
- provide seed data for at least 5 records per main entity where relevant
- create multiple users to demonstrate ownership rules
- keep sample content realistic and correctly spelled

## Quality expectations
- keep controllers thin
- put business logic in services
- use DTOs for create and update requests
- use explicit types
- avoid dead code and commented-out blocks
- keep naming consistent across frontend, backend, and database