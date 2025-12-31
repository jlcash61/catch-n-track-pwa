document.addEventListener("DOMContentLoaded", () => {
  if (typeof L === "undefined") {
    alert("Leaflet failed to load. Check your connection or script tags.");
    return;
  }

  const map = L.map("map").setView([39.5, -98.35], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  map.on("click", (e) => {
    const { lat, lng } = e.latlng;
    console.log("Clicked at:", lat, lng);

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`<b>Lat:</b> ${lat.toFixed(4)}<br><b>Lng:</b> ${lng.toFixed(4)}`)
      .openPopup();
  });

  console.log("Map initialized");
});

const db = new Dexie("CatchNTrackDB");

db.version(1).stores({
  spots: "++id,timestamp,type,notes,lat,lng"
});

let currentMode = "";

const addBtn = document.getElementById("add-btn");
const editBtn = document.getElementById("edit-btn");
const deleteBtn = document.getElementById("delete-btn");
const doneBtn = document.getElementById("done-btn");
const exportBtn = document.getElementById("export-btn");
const importFile = document.getElementById("import-file");

addBtn.onclick = () => setMode("add");
editBtn.onclick = () => setMode("edit");
deleteBtn.onclick = () => setMode("delete");
doneBtn.onclick = () => setMode("");
exportBtn.onclick = exportData;
importFile.onchange = importData;

function setMode(mode) {
  currentMode = mode;
  doneBtn.style.display = mode ? "block" : "none";
  console.log("Mode set to", mode);
}

async function exportData() {
  const allSpots = await db.spots.toArray();
  const blob = new Blob([JSON.stringify(allSpots, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "catch-n-track-export.json";
  a.click();
  URL.revokeObjectURL(url);
}

async function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const text = await file.text();
  const data = JSON.parse(text);
  if (Array.isArray(data)) {
    await db.spots.clear();
    await db.spots.bulkAdd(data);
    alert("Data imported successfully");
  }
}