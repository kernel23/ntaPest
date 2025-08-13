# Agri-Guard: Tobacco Pest Monitoring PWA

Agri-Guard is a Progressive Web App (PWA) designed for monitoring tobacco pests and diseases in the Ilocos Region of the Philippines. It provides a seamless experience for farmers and extension workers to manage their farm plots and track agricultural data, even in offline scenarios.

## Key Features

- **User Authentication**: Secure sign-in using Google, Facebook, or as a Guest, powered by Firebase Authentication.
- **Profile Management**: Users can create and manage their profiles, specifying their role as either a "Farmer" or an "Extension Worker".
- **Farm Plot Management**: Users can add and view their farm plots.
- **Offline First**: The application is a fully-functional PWA with a service worker that caches app resources. This allows users to access the app and previously loaded data even without an internet connection.
- **Real-time Data Sync**: Utilizes Firestore to ensure data is synchronized in real-time across devices.
- **Responsive Design**: A clean, mobile-first interface built with Tailwind CSS.

## User Roles and Workflow

Agri-Guard is built around a collaborative workflow involving four distinct user roles. Each role has specific permissions and functionalities tailored to their responsibilities in the pest and disease monitoring process.

### User Roles

1.  **Farmer**: The primary user of the app.
    *   **Farm Management**: Can add and manage their farm plots, including mapping the geographical boundaries.
    *   **Scouting Reports**: Submits reports of potential pest or disease outbreaks by uploading images, describing symptoms, and noting the severity and distribution of the issue.

2.  **Extension Worker**: Acts as the first line of support and diagnosis.
    *   **Farmer Oversight**: Views a list of assigned farmers and can access their farm plots and reports.
    *   **Initial Diagnosis**: Accesses a queue of pending reports and provides an initial diagnosis by identifying the pest/disease and adding notes.

3.  **Branch Coordinator**: Manages Extension Workers and handles more complex cases.
    *   **Team Management**: Views a list of Extension Workers and can monitor their assigned farmers and activities.
    *   **Final Diagnosis & Treatment**: Accesses reports that have an initial diagnosis and provides a final, confirmed diagnosis along with a detailed treatment plan (including prevention, monitoring, and control measures).
    *   **Escalation**: Can escalate complex or unidentifiable cases to an Expert for advanced analysis.

4.  **Expert**: A subject-matter expert who handles the most critical cases.
    *   **Online Clinic**: Manages a queue of escalated cases that require expert-level diagnosis.
    *   **Definitive Diagnosis**: Provides the final diagnosis and treatment plan for escalated reports.
    *   **Data Analysis**: Accesses a high-level dashboard with an interactive map showing pest/disease distribution, key statistics, and the ability to export all data for research and analysis.

### Application Workflow

The application facilitates a structured, multi-level workflow for identifying and managing agricultural issues:

1.  **Report Submission**: A **Farmer** notices a potential issue on their farm and submits a scouting report with images and details through the app.
2.  **Initial Review**: The report enters a queue for **Extension Workers**. An available worker reviews the report and provides an initial diagnosis.
3.  **Verification & Treatment Plan**: The diagnosed report is then sent to a queue for **Branch Coordinators**. The coordinator verifies the diagnosis, provides a final confirmation, and creates a comprehensive treatment plan.
4.  **Expert Consultation**: If a Branch Coordinator cannot resolve the issue, they **escalate** the case. The report, along with additional notes, is sent to the **Expert's** "Online Clinic."
5.  **Final Resolution**: The **Expert** reviews the escalated case, provides the definitive diagnosis and treatment plan, and communicates it back down the chain.

## Tech Stack

- **Frontend**:
  - HTML5
  - Vanilla JavaScript (ESM)
  - Tailwind CSS
  - [Lucide Icons](https://lucide.dev/)
- **Backend & Hosting**:
  - **Firebase**:
    - Firebase Authentication
    - Firestore Database
    - Firebase Hosting
- **PWA**:
  - Web App Manifest
  - Service Worker API

## Getting Started

To run this project locally, you need a web server. You can use any simple HTTP server.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Serve the `index.html` file.** A simple way is to use Python's built-in HTTP server:
   ```bash
   python -m http.server
   ```
   Or, if you have Node.js:
   ```bash
   npx serve
   ```

3. **Open your browser** and navigate to `http://localhost:8000` (or the port specified by your server).

## Firebase Configuration

The application is configured to use a Firebase project. The configuration details are located in the `<script type="module">` tag within `index.html`.

**IMPORTANT**: To connect this project to your own Firebase instance, you must replace the placeholder `firebaseConfig` object with your project's actual Firebase configuration.

```javascript
// IMPORTANT: Replace with your project's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID" // Optional
};
```

You will also need to set up the following in your Firebase project:
- **Authentication**: Enable Google, Facebook, and Anonymous sign-in providers.
- **Firestore**: Create a Firestore database and set up the necessary security rules.
- **Hosting**: Set up Firebase Hosting if you wish to deploy the application.
