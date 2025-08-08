// For now, this file is intentionally left blank.
// We will add the application logic in the subsequent steps of the plan.
document.addEventListener('DOMContentLoaded', () => {
    console.log("AgriTech Pest Monitor App Initialized");

    // Mock data for pests
    const pestLibrary = [
        "Tobacco Hornworm",
        "Tobacco Budworm",
        "Thrips",
        "Aphids",
        "Whiteflies",
        "Stink Bugs",
        "Tobacco Mosaic Virus (TMV)",
        "Potato Virus Y (PVY)",
        "Black Shank",
        "Blue Mold"
    ];

    // Page content templates
    const pages = {
        'dashboard': `
            <div id="page-dashboard" class="page active">
                <h2>Dashboard</h2>
                <div id="map"></div>
                <h3>All Reports</h3>
                <ul id="dashboard-list">
                    <!-- Reports will be listed here -->
                    <li>No reports yet.</li>
                </ul>
            </div>
        `,
        'farm-setup': `
            <div id="page-farm-setup" class="page">
                <h2>Farm Setup</h2>
                <div class="form-container">
                    <div class="form-group">
                        <label for="farm-name">Farm Name</label>
                        <input type="text" id="farm-name" placeholder="e.g., North Field">
                    </div>
                    <div class="form-group">
                        <label>Farm Location</label>
                        <button id="get-location-btn" class="btn btn-secondary">Get Current Location</button>
                        <p id="location-display">Location not set.</p>
                    </div>
                    <button id="save-farm-btn" class="btn">Save Farm</button>
                </div>
            </div>
        `,
        'new-report': `
            <div id="page-new-report" class="page">
                <h2>New Scouting Report</h2>
                <div class="form-container">
                    <div class="form-group">
                        <label for="report-photo">Upload Photo</label>
                        <input type="file" id="report-photo" accept="image/*">
                    </div>
                    <div class="form-group">
                        <label for="pest-selection">Identified Pest/Disease</label>
                        <select id="pest-selection">
                            <option value="">-- Select One --</option>
                            ${pestLibrary.map(pest => `<option value="${pest}">${pest}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="incidence-rate">Incidence (e.g., 5 out of 10 plants)</label>
                        <input type="text" id="incidence-rate" placeholder="5/10">
                    </div>
                    <div class="form-group">
                        <label for="severity-scale">Severity (Scale 1-5)</label>
                        <input type="number" id="severity-scale" min="1" max="5" placeholder="3">
                    </div>
                    <div class="form-group">
                        <label for="report-notes">Notes</label>
                        <textarea id="report-notes" placeholder="e.g., Found on lower leaves..."></textarea>
                    </div>
                    <button id="save-report-btn" class="btn">Save Report</button>
                </div>
            </div>
        `
    };

    const appContainer = document.getElementById('app-container');
    const navLinks = document.querySelectorAll('.bottom-nav a');

    // --- Navigation Logic ---
    function showPage(pageId) {
        appContainer.innerHTML = pages[pageId];
        navLinks.forEach(link => {
            link.classList.toggle('active', link.id === `nav-${pageId}`);
        });
        // After showing a page, re-attach event listeners for that page
        attachEventListeners(pageId);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const pageId = link.id.replace('nav-', '');
            showPage(pageId);
        });
    });

    // --- Event Listener Logic ---
    function attachEventListeners(pageId) {
        if (pageId === 'farm-setup') {
            document.getElementById('get-location-btn').addEventListener('click', getFarmLocation);
            document.getElementById('save-farm-btn').addEventListener('click', saveFarm);
        }
        if (pageId === 'new-report') {
            document.getElementById('save-report-btn').addEventListener('click', saveReport);
        }
        if (pageId === 'dashboard') {
            // Load map and reports when dashboard is shown
            loadDashboard();
        }
    }

    // --- Local Storage Wrapper ---
    const db = {
        save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
        get: (key) => JSON.parse(localStorage.getItem(key)) || [],
        saveFarm: (farm) => localStorage.setItem('farm', JSON.stringify(farm)),
        getFarm: () => JSON.parse(localStorage.getItem('farm'))
    };

    // --- Feature Logic ---
    function getFarmLocation() {
        if ('geolocation' in navigator) {
            const display = document.getElementById('location-display');
            display.textContent = 'Acquiring location...';
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                display.textContent = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
                display.dataset.lat = latitude;
                display.dataset.lon = longitude;
            }, error => {
                display.textContent = 'Could not get location. Please enable permissions.';
                console.error(error);
            });
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    }

    function saveFarm() {
        const farmName = document.getElementById('farm-name').value;
        const locationDisplay = document.getElementById('location-display');
        const lat = locationDisplay.dataset.lat;
        const lon = locationDisplay.dataset.lon;

        if (!farmName || !lat || !lon) {
            alert('Please provide a farm name and set a location.');
            return;
        }

        const farmData = { name: farmName, latitude: parseFloat(lat), longitude: parseFloat(lon) };
        db.saveFarm(farmData);
        alert(`Farm '${farmName}' saved successfully!`);
        showPage('dashboard');
    }

    function saveReport() {
        // First, check if a farm is set up
        if (!db.getFarm()) {
            alert('Please set up your farm before creating a report.');
            showPage('farm-setup');
            return;
        }

        const newReport = {
            id: Date.now(),
            pest: document.getElementById('pest-selection').value,
            incidence: document.getElementById('incidence-rate').value,
            severity: document.getElementById('severity-scale').value,
            notes: document.getElementById('report-notes').value,
            // In a real app, you'd handle the photo upload to a server. Here we just note the file name.
            photo: document.getElementById('report-photo').files[0]?.name || 'No photo',
            timestamp: new Date().toISOString()
        };

        if (!newReport.pest) {
            alert('Please select a pest or disease.');
            return;
        }

        const reports = db.get('reports');
        reports.push(newReport);
        db.save('reports', reports);

        alert('Report saved successfully!');
        showPage('dashboard');
    }

    function loadDashboard() {
        const reports = db.get('reports');
        const farm = db.getFarm();
        const list = document.getElementById('dashboard-list');
        const mapElement = document.getElementById('map');

        // 1. Populate the list of reports
        list.innerHTML = ''; // Clear previous list
        if (reports.length === 0) {
            list.innerHTML = '<li>No reports yet.</li>';
        } else {
            reports.forEach(report => {
                const item = document.createElement('li');
                item.innerHTML = `
                    <strong>${report.pest}</strong> (Severity: ${report.severity})<br>
                    <small>${new Date(report.timestamp).toLocaleString()}</small>
                `;
                list.appendChild(item);
            });
        }

        // 2. Initialize the map
        if (typeof L === 'undefined') {
            mapElement.innerHTML = 'Map could not be loaded.';
            return;
        }
        if (mapElement._leaflet_id) { // Clear previous map instance
            mapElement._leaflet_id = null;
        }

        const mapCenter = farm ? [farm.latitude, farm.longitude] : [14.5995, 120.9842]; // Default to Manila
        const zoomLevel = farm ? 15 : 8;
        const map = L.map('map').setView(mapCenter, zoomLevel);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // 3. Add markers to the map
        if (farm) {
            // Add a marker for the farm itself
            L.marker([farm.latitude, farm.longitude])
                .addTo(map)
                .bindPopup(`<b>Your Farm: ${farm.name}</b>`)
                .openPopup();

            // Add circle markers for each report at the farm's location
            reports.forEach(report => {
                L.circleMarker([farm.latitude, farm.longitude], {
                    radius: 8,
                    color: '#c0392b', // A slightly different red
                    fillColor: '#e74c3c',
                    fillOpacity: 0.7
                }).addTo(map).bindPopup(`
                    <b>Pest: ${report.pest}</b><br>
                    Severity: ${report.severity}<br>
                    Notes: ${report.notes || 'N/A'}<br>
                    <small>${new Date(report.timestamp).toLocaleString()}</small>
                `);
            });
        }
    }

    // --- Initial Load ---
    showPage('dashboard');
});
