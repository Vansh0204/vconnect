# Volunteer Connect - Group Project

**Volunteer Connect** is a full-stack web platform designed to bridge the gap between enthusiastic volunteers and organisations making a difference. It provides a seamless experience for finding events, signing up, and managing volunteer activities.

---

## 🚀 Project Overview

This project was built to simulate a real-world collaborative environment. We focused on creating a robust platform with three distinct user roles:
1.  **Volunteers**: Can browse events, sign up, and track their impact.
2.  **Organisers**: Can create events, manage volunteers, and validate attendance.
3.  **Admins**: (Future scope) Platform oversight.

### Tech Stack
-   **Frontend**: React, Tailwind CSS
-   **Backend**: Node.js, Express.js
-   **Database**: SQLite (via Prisma ORM)
-   **Authentication**: JWT (JSON Web Tokens)

---

## 👥 Team Contributions

We divided the work into distinct feature sets to simulate a professional workflow.

### 🔹 Aditya Mishra : The Gateway (Auth & Landing)
**Role:** Frontend & Auth Developer
*   **First Impression**: Built the **Landing Page** with a premium, responsive design to attract users.
*   **Security**: Implemented the entire **Authentication System** (JWT-based).
*   **User Entry**: Created **Sign-up** and **Login** modals for both Volunteers and Organisers.
*   **State Management**: Set up the authentication context and protected routes to secure the app.

### 🔹 Vansh Agarwal : The Foundation (Events System)
**Role:** Core Feature Developer
*   **Built the "Heart" of the App**: Implemented the entire Events CRUD (Create, Read, Update, Delete) system.
*   **Backend**: Created `events.controller.js` and routes to handle event data.
*   **Frontend**: Built the **Events Listing Page** (with search/filters), **Event Details Page**, and **Create/Edit Event Forms**.
*   **Infrastructure**: Set up the SQLite database and wrote the `seed.js` script to populate the app with test data.

### 🔹 Pranjal Tripathi : The Volunteer Experience
**Role:** Volunteer Feature Developer
*   **Enabled Participation**: Built the system for volunteers to **Apply** to events.
*   **Profile System**: Created the **Volunteer Profile Page** (view/edit) and **My Events Page** to track signups.
*   **Logic**: Implemented backend checks to prevent duplicate signups and manage event capacity.
*   **Dashboard**: Enhanced the Volunteer Dashboard with real-time stats and navigation.

### 🔹 Priyanshu Verma : The Organiser Tools
**Role:** Organiser Feature Developer
*   **Empowered Organisers**: Built the tools to manage the people behind the events.
*   **Dashboard**: Created the **Organiser Dashboard** showing real-time impact stats (Total Volunteers, Active Events).
*   **Volunteer Management**: Built the **Event Signups Page** where organisers can **Approve**, **Reject**, or **Mark Attended** for each volunteer.
*   **Impact Tracking**: Implemented logic that automatically awards volunteer hours when attendance is marked.

---

## 🔄 Application Workflow

1.  **Organiser Workflow**:
    *   Sign up/Login as an Organiser.
    *   Go to **Dashboard** → Click **Create Event**.
    *   Fill in details (Title, Date, Location, etc.) and Post.
    *   Go to **Manage Volunteers** to see who has applied.
    *   Mark volunteers as **Attended** after the event to give them credit.

2.  **Volunteer Workflow**:
    *   Sign up/Login as a Volunteer.
    *   Browse **Events Page** → Filter by Category/Location.
    *   Click **View Details** → Click **Apply to Volunteer**.
    *   Go to **My Events** to see application status (Registered/Attended).
    *   Check **Profile** to see Total Hours earned.

---

## 🛠️ Setup Instructions (For Evaluator)

Follow these steps to run the project locally.

### Prerequisites
-   Node.js installed
-   Git installed

### 1. Clone & Setup Backend
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup Environment Variables
# Create a .env file with:
# DATABASE_URL="file:./dev.db"
# JWT_SECRET="your-secret-key"
# PORT=4000

# Run Database Migrations
npx prisma migrate dev --name init

# Seed Database (Important! Adds test users/events)
node prisma/seed.js

# Start Server
npm start
```
*Backend runs on: `http://localhost:4000`*

### 2. Setup Frontend
```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start React App
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

### 3. Test Credentials (from Seed)
You can use these pre-created accounts to test the flows:

| Role | Email | Password |
|------|-------|----------|
| **Organiser** | `demo@org.com` | `password123` |
| **Volunteer** | `demo@volunteer.com` | `password123` |

---

## 🧪 Key Features to Test
1.  **Login** as `demo@org.com` and create a new event.
2.  **Login** as `demo@volunteer.com`, find that event, and **Apply**.
3.  **Login** back as Organiser, go to the event, click **Manage Volunteers**, and mark the volunteer as **Attended**.
4.  **Login** back as Volunteer and check **Profile** to see hours increased.

---
*Built with ❤️ by the Volunteer Connect Team*
