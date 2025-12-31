const db = new Dexie("CatchNTrackDB");

db.version(1).stores({
  spots: "++id,timestamp,type,notes,lat,lng"
});

// Default mode
let currentMode = "";

// DOM references
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