# Agri-Guard: Tobacco Pest Monitoring PWA

Agri-Guard is an advanced Progressive Web App (PWA) designed for monitoring tobacco pests and diseases in the Ilocos Region of the Philippines. It provides a seamless, offline-first experience for farmers and agricultural technicians to manage farm plots, track scouting reports, and receive predictive advisories to protect their crops.

## Key Features

-   **Role-Based Access Control**: A multi-level system with five distinct user roles (Farmer, Extension Worker, Branch Coordinator, Expert, Administrator) to ensure a structured and secure workflow.
-   **Comprehensive Farm Management**: Farmers can map their farm plots using Leaflet.js, manage crop details, and view a complete history of scouting reports for each plot.
-   **Offline-First Functionality**: The application is a fully-functional PWA that leverages a robust service worker and IndexedDB to ensure core features are available without an internet connection. This includes:
    -   **Offline Scouting Reports**: Farmers can create and save new pest/disease reports, including images, while offline.
    -   **Offline Farmer Registration**: Extension Workers can register new farmers in the field without an internet connection.
    -   All offline data automatically syncs with Firestore when the connection is restored.
-   **Predictive Advisories**: A sophisticated module that uses weather forecast data to generate timely warnings about potential pest and disease outbreaks, helping farmers take proactive measures.
-   **Advanced Weather Dashboard**: Integrates with the Open-Meteo API to provide detailed, location-specific weather forecasts, including charts for temperature, precipitation, and other key variables.
-   **Real-time Notifications**: An in-app notification system alerts users to important events, such as new report assignments or role changes.
-   **Comprehensive Admin Panel**: An administrator dashboard for managing users, viewing all reports, and approving role change requests.
-   **Data Export**: Experts and administrators can export all report data to a CSV file for research, analysis, and record-keeping.
-   **Secure Authentication**: Powered by Firebase Authentication, allowing users to sign in via Google or as a Guest.

## Application Workflow

Agri-Guard facilitates a structured, multi-level workflow for identifying and managing agricultural issues:

1.  **Report Submission**: A **Farmer** notices a potential issue on their farm and submits a scouting report with images, observed symptoms, severity, and distribution details through the app.
2.  **Initial Diagnosis**: The report is assigned to an **Extension Worker**, who reviews the submission, provides an initial diagnosis, and adds relevant notes.
3.  **Final Diagnosis & Treatment**: The diagnosed report is sent to a **Branch Coordinator**, who verifies the diagnosis, provides a final confirmation, and creates a comprehensive treatment plan (including prevention, monitoring, and control measures).
4.  **Expert Consultation**: If a Branch Coordinator cannot resolve the issue, they can **escalate** the case to an **Expert**, who manages a queue of critical cases in the "Online Clinic."
5.  **Final Resolution**: The **Expert** provides a definitive diagnosis and treatment plan, which is then communicated back to the farmer.

## Tech Stack

-   **Frontend**:
    -   Vanilla JavaScript (ESM)
    -   Tailwind CSS
    -   Leaflet.js (for mapping)
    -   Chart.js (for weather charts)
    -   Lucide Icons
-   **Backend & Hosting**:
    -   **Firebase**:
        -   Firebase Authentication
        -   Firestore Database
        -   Firebase Storage
        -   Firebase Hosting
-   **PWA & Offline**:
    -   Service Worker API
    -   IndexedDB (via `idb` library)
-   **APIs**:
    -   Open-Meteo API (for weather data)

## Getting Started

To run this project locally, you need Node.js and npm installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/agri-guard.git
    cd agri-guard
    ```

2.  **Install dependencies:** This project uses PostCSS and Tailwind CSS for styling.
    ```bash
    npm install
    ```

3.  **Build the CSS:**
    ```bash
    npm run build-css
    ```

4.  **Serve the application:** You can use any simple HTTP server. A common choice is `serve`.
    ```bash
    npx serve
    ```

5.  **Open your browser** and navigate to the local address provided by the server (e.g., `http://localhost:3000`).

## Firebase Configuration

To connect this project to your own Firebase instance, you must replace the placeholder `firebaseConfig` object in `index.html` with your project's actual Firebase configuration keys.

You will also need to enable the following services in your Firebase project:
-   **Authentication**: Enable Google and Anonymous sign-in providers.
-   **Firestore**: Create a Firestore database.
-   **Storage**: Create a Firebase Storage bucket.
-   **Hosting**: Set up Firebase Hosting to deploy the application.