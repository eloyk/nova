# NovaLearn LMS Design Guidelines

## Design Approach

**Selected Approach:** Design System + Educational Platform References

Drawing inspiration from modern LMS platforms (Udemy, Coursera, Canvas) with Material Design principles for clean, functional interfaces that prioritize content accessibility and user productivity.

**Core Principles:**
- Information clarity over decoration
- Consistent, predictable navigation patterns
- Content-first hierarchy
- Efficient task completion for both students and instructors

## Typography System

**Font Family:** Inter or IBM Plex Sans via Google Fonts
- Primary: Inter for UI elements and body text
- Headings: Inter Bold/Semibold for clear hierarchy

**Type Scale:**
- Page Titles: 2xl to 3xl, font-semibold
- Section Headers: xl, font-semibold  
- Card Titles: lg, font-medium
- Body Text: base, font-normal
- Metadata/Labels: sm, font-medium, uppercase tracking
- Captions: xs, font-normal

## Layout System

**Spacing Primitives:** Tailwind units of 3, 4, 6, 8, 12, 16
- Component padding: p-4, p-6
- Section spacing: py-12, py-16
- Card gaps: gap-6, gap-8
- Tight elements: space-y-3

**Grid Structure:**
- Dashboard: 12-column responsive grid
- Course cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Instructor panel: 8-column main + 4-column sidebar
- Content max-width: max-w-7xl for dashboards, max-w-4xl for course content

## Component Library

### Navigation
**Top Navigation Bar:**
- Fixed header with logo left, primary nav center, user menu right
- Height: h-16
- Search bar prominently featured for course discovery
- Notification bell icon with badge counter
- Role indicator (Student/Instructor) in user dropdown

**Sidebar Navigation (Dashboard):**
- Collapsible side panel, w-64 expanded, w-16 collapsed
- Icon + label navigation items
- Active state with left border accent and subtle background
- Persistent across dashboard views

### Course Components

**Course Card:**
- Aspect ratio 16:9 thumbnail image at top
- Course title, instructor name, rating stars
- Progress bar for enrolled courses (student view)
- Enrollment count for catalog view
- "Continue Learning" or "Enroll" button
- Hover: subtle lift effect (translate-y-1 shadow-lg)

**Video Player:**
- Full-width responsive container (16:9 aspect ratio)
- Custom controls overlay with play/pause, timeline, speed, fullscreen
- "Mark as Complete" checkbox below player
- Tabbed interface below: Overview, Resources, Discussions

**Lesson Sidebar:**
- Fixed right panel showing module structure
- Collapsible module sections
- Checkmark icons for completed lessons
- Current lesson highlighted
- Sequential navigation (Previous/Next buttons)

### Dashboard Widgets

**Student Dashboard:**
- Hero section: "Welcome back, [Name]" with quick stats (courses in progress, completed, hours learned)
- "Continue Learning" section: horizontal scrollable course cards
- "My Courses" grid with progress indicators
- "Upcoming Deadlines" list widget (right sidebar)
- Achievement badges/certificates section

**Instructor Dashboard:**
- Top metrics cards: Total Students, Active Courses, Avg. Rating, Revenue (grid-cols-4)
- "Recent Activity" feed with student enrollments/completions
- "Course Performance" chart cards
- Quick action buttons: Create Course, Grade Assignments

### Evaluation Components

**Quiz Interface:**
- Question counter at top (Question 3 of 10)
- Large, clear question text
- Radio buttons/checkboxes with generous padding (p-4)
- "Submit" button disabled until answer selected
- Timer display (optional, top-right)
- Progress dots indicator

**Assignment Submission:**
- File upload dropzone with drag-and-drop
- Uploaded file list with remove option
- Text editor for written responses
- Submit button with confirmation modal
- Due date prominently displayed

### Forms & Inputs

**Course Creation Form:**
- Multi-step wizard interface (stepper component at top)
- Section cards for organized input groups
- Rich text editor for descriptions
- Media upload zones with previews
- Save as Draft / Publish toggle

**Standard Input Fields:**
- Label above input, helper text below
- Consistent height: h-10 for inputs
- Focus ring for accessibility
- Error states with red border and message below

### Data Display

**Tables:**
- Striped rows for readability
- Sortable column headers (icon indicator)
- Action buttons (icon buttons) in rightmost column
- Pagination at bottom center
- Bulk actions when checkboxes selected

**Progress Indicators:**
- Linear progress bars with percentage label
- Circular progress for course completion (on cards)
- Color coding: 0-33% (muted), 34-66% (medium), 67-100% (success tone)

### Modals & Overlays

**Modal Structure:**
- Centered overlay with backdrop blur
- Max width: max-w-2xl for content, max-w-md for confirmations
- Header with title and close button
- Footer with action buttons (right-aligned)

## Images

**Hero Image:** 
Large banner image on main landing page showing diverse students learning together, modern classroom or digital learning environment. Full-width, height approximately 60vh on desktop, 40vh mobile.

**Course Thumbnails:**
Each course card requires a representative image. Use varied educational imagery: books, laptops, specific subject matter (coding screens, science diagrams, language books). Consistent 16:9 aspect ratio.

**Profile Avatars:**
User profile images throughout interface - navigation, comment sections, instructor profiles. Circular, size variants: sm (h-8 w-8), md (h-12 w-12), lg (h-24 w-24).

**Empty States:**
Illustrations for "No courses enrolled," "No assignments due," etc. Centered, friendly illustrations with actionable CTA below.

## Responsive Behavior

- Mobile: Single column, stacked navigation (hamburger menu)
- Tablet: Two-column course grids, collapsed sidebar
- Desktop: Full multi-column layouts, persistent navigation

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation for video player and course navigation
- Focus visible states on all interactive components
- Screen reader announcements for progress updates
- Color-independent status indicators (icons + text)