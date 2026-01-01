import { db } from './db.js';

export function initMap() {
    window.map = L.map('map').setView([39, -98], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(window.map);

    window.currentMode = '';

    map.on('click', (e) => {
        if (window.currentMode === 'add') {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            const fishType = prompt("Fish caught?");
            const baitUsed = prompt("Bait used?");
            const notes = prompt("Notes?");
            const timestamp = new Date().toLocaleString();

            const marker = L.marker([lat, lng]).addTo(map).bindPopup(`
                <b>Fish:</b> ${fishType}<br>
                <b>Bait:</b> ${baitUsed}<br>
                <b>Notes:</b> ${notes}<br>
                <b>Time:</b> ${timestamp}
            `).openPopup();

            const tx = db.transaction(["fishingSpots"], "readwrite");
            tx.objectStore("fishingSpots").add({ latitude: lat, longitude: lng, fishType, baitUsed, notes, timestamp });
        }
    });
}

export function loadUserData() {
    const tx = db.transaction(["fishingSpots"], "readonly");
    const request = tx.objectStore("fishingSpots").getAll();

    request.onsuccess = () => {
        request.result.forEach(spot => {
            const { latitude, longitude, fishType, baitUsed, notes, timestamp, id } = spot;

            const marker = L.marker([latitude, longitude]).addTo(window.map);

            // Set popup content with a Share button
            const popupContent = document.createElement("div");
            popupContent.innerHTML = `
                <b>Fish:</b> ${fishType}<br>
                <b>Bait:</b> ${baitUsed}<br>
                <b>Notes:</b> ${notes}<br>
                <b>Time:</b> ${timestamp}<br>
                <button class="share-spot-btn" data-id="${id}">Share</button>
            `;

            marker.bindPopup(popupContent);

            // Handle popup open event to attach listener
            marker.on('popupopen', () => {
                const shareBtn = popupContent.querySelector(".share-spot-btn");
                if (shareBtn) {
                    shareBtn.onclick = () => {
                        const shareText = `🎣 Fishing Spot:
Fish: ${fishType}
Bait: ${baitUsed}
Notes: ${notes}
Location: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}
Time: ${timestamp}`;

                        if (navigator.share) {
                            navigator.share({
                                title: "Shared Fishing Spot",
                                text: shareText
                            }).catch(err => console.error("Share failed:", err));
                        } else {
                            navigator.clipboard.writeText(shareText)
                                .then(() => alert("Spot copied to clipboard!"))
                                .catch(() => alert("Unable to copy."));
                        }
                    };
                }
            });

            // Edit/Delete behavior
            marker.on('click', () => {
                if (window.currentMode === 'edit') {
                    const newFish = prompt("New fish:", fishType);
                    const newBait = prompt("New bait:", baitUsed);
                    const newNotes = prompt("New notes:", notes);
                    const newTime = new Date().toLocaleString();

                    const tx = db.transaction(["fishingSpots"], "readwrite");
                    tx.objectStore("fishingSpots").put({
                        id, latitude, longitude,
                        fishType: newFish,
                        baitUsed: newBait,
                        notes: newNotes,
                        timestamp: newTime
                    });

                    marker.setPopupContent(`
                        <b>Fish:</b> ${newFish}<br>
                        <b>Bait:</b> ${newBait}<br>
                        <b>Notes:</b> ${newNotes}<br>
                        <b>Time:</b> ${newTime}<br>
                        <button class="share-spot-btn" data-id="${id}">Share</button>
                    `);
                } else if (window.currentMode === 'delete') {
                    if (confirm("Delete this spot?")) {
                        db.transaction(["fishingSpots"], "readwrite").objectStore("fishingSpots").delete(id);
                        window.map.removeLayer(marker);
                    }
                }
            });
        });
    };
}
