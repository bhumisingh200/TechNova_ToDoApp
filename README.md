# 🚀 TechNova Task Manager & Productivity Dashboard

<div align="center">

### A Modern Productivity & Task Management Platform

An advanced productivity dashboard built with **HTML5, CSS3, and Vanilla JavaScript**, featuring Kanban workflows, Pomodoro focus sessions, productivity analytics, gamification, and persistent local storage.

<p>
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
<img src="https://img.shields.io/badge/Responsive-Yes-success?style=for-the-badge"/>
<img src="https://img.shields.io/badge/LocalStorage-Persistent-blue?style=for-the-badge"/>
</p>

</div>

---

# 📖 Overview

TechNova Task Manager is a feature-rich productivity application designed to help users organize their daily workflow efficiently.

Unlike a basic To-Do application, it combines task management, Kanban boards, Pomodoro focus sessions, analytics dashboards, achievements, data export/import, and customizable themes into a single responsive workspace.

All application data is stored locally using the browser's LocalStorage API, allowing users to continue working even after refreshing the page.

---

# ✨ Features

## 👤 User Workspace & Database Security

* User Registration & Login with validation
* Personalized Dashboard
* Session Management (forced login screen on reload to enable account switching)
* Secure Persistent Database (MySQL `technova_db` with `todo_users` and `todo_states` tables)
* Welcome Messages

---

## ✅ Task Management

Create and manage tasks with:

* Title
* Description
* Priority Levels
* Dynamic categories (with dynamic custom category creator in sidebar!)
* Due Dates
* Custom Tags
* Pin Tasks
* Favorite Tasks
* Edit Tasks
* Delete Tasks
* Mark Complete

---

## 📊 Productivity Dashboard

Monitor productivity using:

* Animated Statistics Cards
* Completion Progress Ring
* Task Completion Percentage
* Weekly Analytics Charts
* Focus Drawer
* Productivity Summary

---

## 📋 Kanban Board

Interactive drag-and-drop workflow.

Columns include:

* To Do
* Doing
* Done

Features:

* Drag & Drop
* Live Counters
* Quick Add
* Instant Updates
* **Tabbed Kanban Display on Mobile:** Compact viewports feature tab switches (To Do / Doing / Done) to hide inactive columns and maximize height space.

---

## 📅 Calendar Planner

* Monthly Calendar View
* Due Date Indicators
* Daily Task Drawer
* Previous / Next Month Navigation

---

## ⏱ Pomodoro Focus Timer

* Customizable session duration selector (15, 25, 30, 45, and 60 minutes)
* 25-Minute default Focus Sessions
* Break Notifications (Short Break defaults to 5 minutes)
* Task Linking
* Focus Statistics
* Audio Alerts (via Web Audio API)

---

## 🏆 Achievement System

Unlock badges such as:

* First Task Completed
* Productivity Titan
* Flow State Master
* Daily Streak
* Backup Hero

---

## 🔍 Search & Filters

Powerful filtering options:

* Search Tasks
* Category Filter
* Status Filter
* Favorites
* Pinned Tasks
* Priority Filter

Sorting options:

* Due Date
* Priority
* Name
* Completion Status

---

## 💾 Data Management

* LocalStorage Persistence
* JSON Export
* JSON Import
* CSV Export
* Workspace Reset

---

## 🎨 UI Features

* Glassmorphism Design
* Dark / Light Mode
* Accent Color Themes
* Responsive Layout
* Smooth Animations
* Mobile Friendly

---

# 🛠 Technology Stack

## Frontend

* HTML5 (Semantic Structure)
* CSS3 (Vanilla Custom Properties & Glassmorphic variables)
* JavaScript (ES6 asynchronous fetch and AJAX calls)

## Backend & Database

* Node.js (native `http`, `fs`, `path` modules)
* MySQL database server (execSync client runner integration)

## Browser APIs

* Drag & Drop API
* Web Audio API (Synthesizer tones)
* Canvas API

## Libraries

* Chart.js

---

# 📂 Project Structure

```text
TechNova_TaskManager/
│
├── index.html
├── styles.css
├── app.js
├── db.js
├── server.js
└── README.md
```

---

# 🚀 Getting Started

### Prerequisites

* Node.js installed locally.
* MySQL running on `localhost:3306` with username `root` and password `Bhumi@2006` (or customize inside `db.js`).

### Run the App

1. Navigate to the project directory:
   ```bash
   cd TechNova_ToDoApp
   ```
2. Start the backend server:
   ```bash
   node server.js
   ```
3. Open your browser and visit:
   ```text
   http://localhost:3001
   ```

---

# 📊 Application Workflow

```text
Login
   │
   ▼
Dashboard
   │
Create Tasks
   │
Organize with Categories
   │
Track Progress
   │
Focus with Pomodoro
   │
Analyze Productivity
   │
Export Workspace
```

---

# 📸 Screenshots

Create a folder named:

```text
screenshots/
```

Add the following screenshots.

---

## 🏠 Dashboard

File:

```text
screenshots/dashboard.png
```

Capture:

* Statistics Cards
* Progress Ring
* Welcome Section

```md
![Dashboard](screenshots/dashboard.png)
```

---

## 🔐 Login Page

```text
screenshots/login.png
```

Capture:

* Login Form
* Sign Up Option

---

## ✅ Task Management

```text
screenshots/task-management.png
```

Show:

* Task Cards
* Priorities
* Categories
* Due Dates

---

## 📋 Kanban Board

```text
screenshots/kanban-board.png
```

Show:

* To Do
* Doing
* Done
* Drag & Drop

---

## 📅 Calendar

```text
screenshots/calendar.png
```

---

## 📊 Analytics Dashboard

```text
screenshots/analytics.png
```

Capture:

* Chart.js Graphs
* Completion Statistics

---

## ⏱ Pomodoro Timer

```text
screenshots/pomodoro.png
```

---

## 🏆 Achievements

```text
screenshots/achievements.png
```

---

## 🔍 Search & Filters

```text
screenshots/search-filter.png
```

---

## 🎨 Theme Customizer

```text
screenshots/themes.png
```

Show:

* Dark Mode
* Accent Colors

---

## 📱 Mobile Responsive View

```text
screenshots/mobile.png
```

Capture using Chrome DevTools mobile mode.

---

# 🚀 Future Enhancements

* Cloud Synchronization
* Google Authentication
* Team Workspaces
* Shared Projects
* Email Notifications
* AI Task Prioritization
* Voice Commands
* Progressive Web App (PWA)

---

# 👩‍💻 Author

## Bhumi Singh

**B.Tech CSE (Artificial Intelligence)**

Aspiring Software Engineer | Java Full Stack Developer | Frontend Developer

---

⭐ If you found this project useful, consider giving it a **Star** on GitHub!
