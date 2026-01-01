import { db } from './db.js';

export function exportFishingSpots() {
    const tx = db.transaction(["fishingSpots"], "readonly");
    const store = tx.objectStore("fishingSpots");
    const request = store.getAll();

    request.onsuccess = () => {
        const spots = request.result;
        const json = JSON.stringify(spots, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        // Try Web Share API
        if (navigator.canShare && navigator.canShare({ files: [blob] })) {
            navigator.share({
                title: "CatchNTrack Spots Backup",
                files: [new File([blob], "fishing-spots.json", { type: "application/json" })]
            }).catch(console.error);
        } else {
            // Fallback to download
            const a = document.createElement('a');
            a.href = url;
            a.download = "fishing-spots.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };
}
