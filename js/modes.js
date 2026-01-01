export function setupModeButtons() {
    const modes = ['add', 'edit', 'delete'];
    modes.forEach(mode => {
        document.getElementById(`${mode}-btn`).addEventListener('click', () => {
            window.currentMode = mode;
            document.getElementById('done-btn').style.display = 'block';
            alert(`${mode.charAt(0).toUpperCase() + mode.slice(1)} mode enabled.`);
        });
    });

    document.getElementById('done-btn').addEventListener('click', () => {
        window.currentMode = '';
        document.getElementById('done-btn').style.display = 'none';
        alert("Mode exited.");
    });
}
