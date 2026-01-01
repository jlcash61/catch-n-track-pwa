import { initIndexedDB } from './db.js';
import { initMap } from './map.js';
import { setupModeButtons } from './modes.js';
import { showUserLocationAndData } from './geo.js';

//import { exportFishingSpots } from './export.js';
//import { importFishingSpotsFromFile } from './import.js';




ddocument.addEventListener("DOMContentLoaded", async () => {
  await initIndexedDB(); // Wait until DB is ready
  initMap();
  setupModeButtons();
  showUserLocationAndData();

    /*
document.getElementById('export-btn').addEventListener('click', exportFishingSpots);
document.getElementById('import-btn').addEventListener('click', () => {
document.getElementById('import-file').click();
});
document.getElementById('import-file').addEventListener('change', (e) => {
if (e.target.files.length > 0) {
importFishingSpotsFromFile(e.target.files[0]);
}
});
*/

});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(reg => {
      console.log("Service Worker registered:", reg.scope);
      reg.update();

      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            if (confirm("A new version is available. Reload?")) {
              window.location.reload();
            }
          }
        });
      });
    })
    .catch(err => console.error("Service Worker registration failed:", err));
}

if (window.location.hash.startsWith('#import=')) {
  try {
    const data = atob(window.location.hash.replace('#import=', ''));
    const spot = JSON.parse(data);
    const tx = db.transaction(["fishingSpots"], "readwrite");
    const store = tx.objectStore("fishingSpots");
    store.add(spot);
    alert("Shared spot imported successfully!");
  } catch (err) {
    alert("Failed to import shared spot.");
    console.error(err);
  }
}

