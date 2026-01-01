import { db } from './db.js';
import { loadUserData } from './map.js';

export function importFishingSpotsFromFile(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const spots = JSON.parse(event.target.result);
            const tx = db.transaction(["fishingSpots"], "readwrite");
            const store = tx.objectStore("fishingSpots");

            spots.forEach(spot => {
                delete spot.id; // Let IndexedDB auto-assign
                store.add(spot);
            });

            tx.oncomplete = () => {
                alert("Import successful!");
                loadUserData();
            };
        } catch (e) {
            alert("Invalid JSON format.");
        }
    };
    reader.readAsText(file);
}
