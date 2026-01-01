export let db;

export function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("CatchNTrackDB", 1);

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            db.createObjectStore("fishingSpots", { keyPath: "id", autoIncrement: true });
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("IndexedDB initialized.");
            import('./geo.js').then(mod => mod.showUserLocationAndData());
            resolve(); // ✅ NOW it resolves when db is ready
        };

        request.onerror = (event) => {
            console.error("IndexedDB error:", event.target.errorCode);
            reject(event.target.error);
        };
    });
}
