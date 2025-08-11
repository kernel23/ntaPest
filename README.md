# Agri-Guard: Tobacco Pest Monitoring PWA

Agri-Guard is a Progressive Web App (PWA) designed for monitoring tobacco pests and diseases in the Ilocos Region of the Philippines. It provides a seamless experience for farmers and extension workers to manage their farm plots and track agricultural data, even in offline scenarios.

## Key Features

- **User Authentication**: Secure sign-in using Google, Facebook, or as a Guest, powered by Firebase Authentication.
- **Profile Management**: Users can create and manage their profiles, specifying their role as either a "Farmer" or an "Extension Worker".
- **Farm Plot Management**: Users can add and view their farm plots.
- **Offline First**: The application is a fully-functional PWA with a service worker that caches app resources. This allows users to access the app and previously loaded data even without an internet connection.
- **Real-time Data Sync**: Utilizes Firestore to ensure data is synchronized in real-time across devices.
- **Responsive Design**: A clean, mobile-first interface built with Tailwind CSS.

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
