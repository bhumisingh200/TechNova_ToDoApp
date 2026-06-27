# TechNova | Premium Task Manager & Productivity Dashboard

TechNova is an advanced, high-performance To-Do application and productivity workspace built using vanilla web technologies. It is designed to offer a beautiful, desktop-class experience with interactive widgets, custom analytics, gamification, and robust data management.

---

## 🚀 Key Features

### 1. User Authentication System
* **Personalized Workspaces:** Secure user signup and login portal powered entirely by client-side local storage validation.
* **Access Control:** Restricts workspace access and keeps dashboard profiles isolated.
* **Greeting & Session State:** Welcomes users dynamically (e.g., "Welcome back, Achiever!") and supports instant session logging out.

### 2. Interactive Productivity Dashboard
* **Dynamic Progress Indicators:** Live SVG-based ring tracking overall task completion percentage.
* **Animated Counter Cards:** High-level metrics showing *Total Tasks*, *Completed*, *Pending*, and *Completion Rate* that animate upwards on page load.
* **Analytics Trends:** Visualized double-dataset area charts (Tasks Completed vs. Pending over the last 7 days) rendered dynamically using Chart.js.
* **Focus Drawer:** Dedicated card displaying pinned and high-priority tasks requiring urgent attention.

### 3. Comprehensive Task Management (CRUD)
* **Creation & Modification:** Quick-action overlay modal for creating or updating tasks.
* **Metadata Rich:** Supports titles, detailed descriptions, priorities (🟢 Low, 🟡 Medium, 🔴 High), due dates, categories, and custom comma-separated tags.
* **In-Place Actions:** Easily complete, edit, pin, favorite, or delete tasks directly from task lists or Kanban cards.

### 4. Advanced Sorting, Filtering & Search
* **Status Filters:** Dedicated tabs for *All*, *Active*, *Completed*, *Pinned*, and *Favorites*.
* **Semantic Category Filters:** Sidebar classification links for *Work*, *Personal*, *Study*, and *Health*.
* **Dynamic Search:** Global search bar targeting titles, descriptions, and hashtags (`#tags`).
* **Advanced Sorting:** Sort dynamically by *Pinned First*, *Due Date (Ascending)*, *Priority (High to Low)*, *Name (A-Z)*, or *Completion Status*.

### 5. Interactive Kanban Board
* **Visual Workflows:** Three column layouts: *To Do*, *Doing*, and *Done* with individual header counters.
* **Drag-and-Drop Interface:** Intuitive HTML5 Drag and Drop APIs with smooth drop-zone animations, instantly syncing database and task state.
* **Quick-Add Actions:** Direct column action buttons to insert items straight into a specific workflow status.

### 6. Monthly Productivity Calendar
* **Visual Calendar Grid:** A custom-rendered monthly calendar grid highlighting days that have scheduled due dates.
* **Task Calendaring:** Month-by-month navigation (prev/next).
* **Day-Level Details:** Clicking any day reveals a dedicated slide-out drawer containing a list of tasks due on that specific date.

### 7. Integrated Pomodoro Focus Timer
* **Mini Header Widget:** Dedicated countdown timer (25-minute standard focus interval) persistent across views.
* **Task Linking:** Link an active task directly to the Pomodoro timer via a dropdown selector to log focus hours.
* **Interval Completion:** Tracks completed Pomodoro counters per task. Alerts users with dual chime notifications upon completion.

### 8. Gamified Achievements & Audio Feedback
* **Achievement Milestones:** Grid of unlockable badges such as *First Steps* (🏆), *Productivity Titan* (👑), *Flow State Master* (🧘), and *Safe & Sound* (💾).
* **Web Audio Synthesis:** Uses the Web Audio API to synthesize custom chimes, arpeggios, and alarm tones client-side for task completions and milestone unlocks.
* **Real-time Toasts:** Interactive notifications highlighting milestone progress and actions.

### 9. Portable Data Tools
* **JSON Export:** Back up your workspace settings, stats, and tasks into a downloadable JSON file.
* **CSV Export:** Save tasks in a spreadsheet-compatible comma-separated format.
* **JSON Backup Import:** Restore complete task logs, theme colors, achievements, and statistics from backup.
* **Hard Reset:** A secure danger zone action to permanently purge all workspace storage, settings, and themes.

### 10. Responsive Design & Visual Styling
* **Fluid Layouts:** Sleek modern dashboard featuring glassmorphism, responsive grids, and clean fonts.
* **Color Customizer:** Real-time HSL color themes (supporting Blue, Purple, and Green accents).
* **Light/Dark Modes:** Highly responsive contrast controller with animated theme transitions.
* **Mobile Support:** Adaptive layouts with responsive toggles for mobile viewports.

---

## 🛠️ Technology Stack

* **Structure:** Semantic HTML5
* **Styling:** Vanilla CSS (Modern custom properties/variables, flexbox, CSS grid, HSL-color spaces, dynamic keyframe animations)
* **Logic:** Vanilla JavaScript (ES6+, LocalStorage state synchronization, Web Audio API, HTML5 Drag & Drop)
* **Visualization:** Chart.js (CDN-delivered canvas plotting)

---

## 📂 File Architecture

* **[index.html](file:///c:/Users/admin/Downloads/WebTask3/TechNova_ToDoApp/index.html):** The primary UI document containing views, header controls, auth modals, and core page structure.
* **[styles.css](file:///c:/Users/admin/Downloads/WebTask3/TechNova_ToDoApp/styles.css):** Global styling, HSL dark/light variables, theme accents, responsive media queries, and transition animations.
* **[app.js](file:///c:/Users/admin/Downloads/WebTask3/TechNova_ToDoApp/app.js):** Client-side application script managing authentication routing, timer loop, Web Audio generation, drag/drop handlers, calendar generation, and state persistence.

---

## 🏃 Getting Started

1. Double-click **[index.html](file:///c:/Users/admin/Downloads/WebTask3/TechNova_ToDoApp/index.html)** to load the app directly in any modern browser.
2. Sign up or use default credentials (no server or backend environment setup is required).
3. Experience fully functional persistent dashboards, timer sessions, and game badges!
