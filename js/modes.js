export function setupModeButtons() {
    const modes = ['add', 'edit', 'delete'];

    modes.forEach(mode => {
        const desktopBtn = document.getElementById(`${mode}-btn`);
        const mobileBtn = document.getElementById(`${mode}-btn-mobile`);

        [desktopBtn, mobileBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    window.currentMode = mode;
                    document.getElementById('done-btn').style.display = 'block';
                    document.getElementById('done-btn-mobile').style.display = 'block';
                    alert(`${mode.charAt(0).toUpperCase() + mode.slice(1)} mode enabled.`);
                });
            }
        });
    });

    const doneButtons = [
        document.getElementById('done-btn'),
        document.getElementById('done-btn-mobile')
    ];

    doneButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                window.currentMode = '';
                doneButtons.forEach(b => b.style.display = 'none');
                alert("Mode exited.");
            });
        }
    });
}
