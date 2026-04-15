# StudyBuddy Coding Standards

## General principles
- write clean, production-style code
- no commented-out code blocks
- no placeholder lorem ipsum or nonsense data
- prefer clear names over clever names
- keep functions and methods focused
- solve TypeScript warnings instead of ignoring them

## Frontend standards
- use Angular standalone components
- use reactive forms for non-trivial forms
- keep page components thin when possible
- move API communication into services
- use route guards for protected pages
- keep Tailwind classes readable and grouped logically
- do not mix unrelated responsibilities in one component

## Backend standards
- use NestJS modules, controllers, and services consistently
- controllers handle HTTP concerns only
- services contain business logic
- use DTOs with validation decorators
- use Prisma through a dedicated Prisma service
- enforce authorization rules in the backend service layer

## Data standards
- use realistic names, course codes, locations, and descriptions
- timestamps should be stored consistently
- enforce unique constraints where appropriate
- never store plain text passwords

## Naming conventions
- database tables and Prisma models should use consistent singular naming
- API route names should be plural and predictable
- Angular components, services, and models should use descriptive names
- avoid abbreviations unless they are standard and obvious

## Error handling
- show user-friendly error messages in the UI
- log meaningful backend errors
- return correct HTTP status codes
- validate input both on client and server where relevant

## Testing expectations
- test at least the critical service logic and auth flows
- test the most important CRUD paths
- do not add fake tests that assert trivial behavior only

## Do not do this
- do not bypass auth for convenience
- do not hardcode ownership checks only in the UI
- do not duplicate the same business rule in many places unnecessarily
- do not create giant components or giant services without structure
