// Initialize IndexedDB
let db;

function initIndexedDB() {
    const request = indexedDB.open("CatchNTrackDB", 1);

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        const objectStore = db.createObjectStore("fishingSpots", { keyPath: "id", autoIncrement: true });
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("IndexedDB initialized.");
        showUserLocationAndData();
    };

    request.onerror = function (event) {
        console.error("IndexedDB error:", event.target.errorCode);
    };
}

// Initialize the map
var map = L.map('map').setView([39, -98], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let currentMode = '';

// Mode Buttons
function showDoneButton() {
    document.getElementById('done-btn').style.display = 'block';
}

function hideDoneButton() {
    document.getElementById('done-btn').style.display = 'none';
}

document.getElementById('add-btn').addEventListener('click', () => {
    currentMode = 'add';
    showDoneButton();
    alert("Add mode enabled. Click on the map to add a new fishing spot.");
});

document.getElementById('edit-btn').addEventListener('click', () => {
    currentMode = 'edit';
    showDoneButton();
    alert("Edit mode enabled. Click on a marker to edit its details.");
});

document.getElementById('delete-btn').addEventListener('click', () => {
    currentMode = 'delete';
    showDoneButton();
    alert("Delete mode enabled. Click on a marker to delete it.");
});

document.getElementById('done-btn').addEventListener('click', () => {
    currentMode = '';
    hideDoneButton();
    alert("Mode exited. You can now interact with the map freely.");
});

function showUserLocationAndData() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            map.setView([lat, lng], 13);
            L.marker([lat, lng]).addTo(map).bindPopup('You are here!').openPopup();
            fetchWeatherAndAstronomy(lat, lng);
            loadUserData();
        }, () => alert('Geolocation failed or was denied.'));
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function fetchWeatherAndAstronomy(lat, lon) {
    document.getElementById('weather-info').innerText = `Weather and Moon data unavailable (placeholder)`;
}

function clearMap() {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    document.getElementById('weather-info').innerText = '';
}

function saveFishingSpotToIndexedDB(data) {
    const tx = db.transaction(["fishingSpots"], "readwrite");
    const store = tx.objectStore("fishingSpots");
    store.add(data);
    tx.oncomplete = () => alert("Fishing spot added successfully!");
    tx.onerror = () => alert("Error saving fishing spot.");
}

function loadUserData() {
    const tx = db.transaction(["fishingSpots"], "readonly");
    const store = tx.objectStore("fishingSpots");
    const request = store.getAll();

    request.onsuccess = function (event) {
        const spots = event.target.result;
        spots.forEach(data => {
            const { latitude, longitude, fishType, baitUsed, notes, timestamp, id } = data;
            const marker = L.marker([latitude, longitude]).addTo(map).bindPopup(`
                <b>Fish:</b> ${fishType}<br>
                <b>Bait:</b> ${baitUsed}<br>
                <b>Notes:</b> ${notes}<br>
                <b>Time:</b> ${timestamp}
            `);

            marker.on('click', () => {
                if (currentMode === 'edit') {
                    const newFishType = prompt("Enter the new type of fish:", fishType);
                    const newBaitUsed = prompt("Enter the new bait used:", baitUsed);
                    const newNotes = prompt("Enter any new notes:", notes);
                    const updatedData = {
                        id,
                        latitude,
                        longitude,
                        fishType: newFishType,
                        baitUsed: newBaitUsed,
                        notes: newNotes,
                        timestamp: new Date().toLocaleString()
                    };
                    const updateTx = db.transaction(["fishingSpots"], "readwrite");
                    updateTx.objectStore("fishingSpots").put(updatedData);
                    updateTx.oncomplete = () => {
                        marker.setPopupContent(`
                            <b>Fish:</b> ${newFishType}<br>
                            <b>Bait:</b> ${newBaitUsed}<br>
                            <b>Notes:</b> ${newNotes}<br>
                            <b>Time:</b> ${updatedData.timestamp}
                        `);
                        alert("Spot updated!");
                    };
                } else if (currentMode === 'delete') {
                    if (confirm("Delete this spot?")) {
                        const deleteTx = db.transaction(["fishingSpots"], "readwrite");
                        deleteTx.objectStore("fishingSpots").delete(id);
                        map.removeLayer(marker);
                        alert("Spot deleted!");
                    }
                }
            });
        });
    };
}

map.on('click', function (e) {
    if (currentMode === 'add') {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        const fishType = prompt("Enter the type of fish caught:");
        const baitUsed = prompt("Enter the bait used:");
        const notes = prompt("Enter any additional notes:");
        const timestamp = new Date().toLocaleString();

        const marker = L.marker([lat, lng]).addTo(map).bindPopup(`
            <b>Fish:</b> ${fishType}<br>
            <b>Bait:</b> ${baitUsed}<br>
            <b>Notes:</b> ${notes}<br>
            <b>Time:</b> ${timestamp}
        `).openPopup();

        saveFishingSpotToIndexedDB({ latitude: lat, longitude: lng, fishType, baitUsed, notes, timestamp });
    }
});

initIndexedDB();
