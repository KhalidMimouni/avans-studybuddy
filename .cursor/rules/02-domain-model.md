# StudyBuddy Domain Model

## Domain summary
StudyBuddy helps students organize collaborative studying around courses, study groups, and planned study sessions.

## Entities

### User
Fields:
- id
- firstName
- lastName
- email
- passwordHash
- studentNumber
- program
- createdAt
- updatedAt

Rules:
- email must be unique
- password is never stored in plain text
- a user can create many study groups
- a user can enroll in many study sessions through enrollments

### Course
Fields:
- id
- name
- code
- description
- studyYear
- semester
- isActive
- createdAt
- updatedAt

Rules:
- code should be unique if possible
- a course can have many study groups

### StudyGroup
Fields:
- id
- title
- description
- meetingLocation
- maxMembers
- isPrivate
- ownerId
- courseId
- createdAt
- updatedAt

Rules:
- belongs to exactly one owner
- belongs to exactly one course
- can have many study sessions
- only the owner may update or delete the study group

### StudySession
Fields:
- id
- title
- sessionDate
- startTime
- endTime
- status
- notes
- studyGroupId
- createdAt
- updatedAt

Rules:
- belongs to exactly one study group
- can have many enrollments
- only the owner of the parent study group may create, update, or delete sessions
- endTime must be later than startTime

### Enrollment
Fields:
- id
- userId
- studySessionId
- joinedAt
- attendanceStatus
- motivation
- createdAt
- updatedAt

Rules:
- belongs to exactly one user
- belongs to exactly one study session
- combination of userId and studySessionId must be unique
- acts as the weak entity in the model

## Relationships
- User 1..N StudyGroup
- Course 1..N StudyGroup
- StudyGroup 1..N StudySession
- User N..M StudySession through Enrollment

## Strong and weak entities
Strong entities:
- Course
- StudyGroup
- StudySession

Weak entity:
- Enrollment

## Authorization rules
- guests can only access public read-only pages
- authenticated users can create study groups
- only the owner of a study group can edit or delete that study group
- only the owner of the parent study group can manage study sessions
- authenticated users can enroll in or leave study sessions
- users can only edit their own profile data

## Business assumptions
- a study session always belongs to a study group
- a study group always belongs to a course
- an enrollment cannot exist without both a user and a study session
- a user may not enroll twice in the same study session
