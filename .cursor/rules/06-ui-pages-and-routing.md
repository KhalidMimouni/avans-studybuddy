# StudyBuddy UI Pages and Routing

## Main pages

### Public pages
- `/` home page
- `/login` login page
- `/register` register page
- `/about` about page

### Course pages
- `/courses` course overview
- `/courses/:id` course detail

### Study group pages
- `/study-groups` study group overview
- `/study-groups/new` create study group
- `/study-groups/:id` study group detail
- `/study-groups/:id/edit` edit study group

### Study session pages
- `/study-sessions` study session overview
- `/study-sessions/:id` study session detail
- `/study-groups/:groupId/sessions/new` create study session
- `/study-sessions/:id/edit` edit study session

### User pages
- `/my-enrollments` list of the current user's enrollments
- `/profile` current user profile

## Page responsibilities

### Home page
- short introduction to StudyBuddy
- CTA to browse groups or sign up

### Overview pages
Each overview page should support:
- list or grid display
- search and filtering where relevant
- navigation to detail pages
- clear empty states

### Detail pages
Each detail page should show:
- main entity information
- related entity information
- action buttons when the user is authorized
- navigation back to the overview

## UI/UX expectations
- keep navigation simple and predictable
- use clear headings and sectioning
- make create/edit forms easy to scan
- use consistent buttons and status badges
- make filtering obvious and usable
- design for realistic student usage, not just for technical completeness
