export function initClock() {
  let clockRAF = null;
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const clockDisplay = document.getElementById('clockDisplay');
    if (clockDisplay) clockDisplay.textContent = h + ':' + m + ':' + s;
    clockRAF = requestAnimationFrame(updateClock);
  }
  if (clockRAF) cancelAnimationFrame(clockRAF);
  updateClock();
}