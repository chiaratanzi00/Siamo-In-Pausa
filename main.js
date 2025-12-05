// =====================================
// 1. CONFIGURAZIONE DI BASE
// =====================================

const BREAK_DURATION_MS = 15 * 60 * 1000; // 15 minuti
let timerId = null;
let endTime = null;


// =====================================
// 2. ELEMENTI DOM
// =====================================

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const countdownEl = document.getElementById("countdown");
const startTimeEl = document.getElementById("startTime");
const endTimeEl = document.getElementById("endTime");
const messageEl = document.getElementById("message");


// =====================================
// 3. FUNZIONI DI UTILITÀ
// =====================================

// Format HH:MM
function formatHHMM(date) {
  return date.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Format mm:ss
function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


// =====================================
// 4. AGGIORNA COUNTDOWN OGNI SECONDO
// =====================================

function updateCountdown() {
  const now = Date.now();
  const diff = endTime - now;

  // Timer terminato
  if (diff <= 0) {
    countdownEl.textContent = "00:00";
    countdownEl.className = "countdown red";
    messageEl.textContent = "🐾 La pausa è finita!";

    clearInterval(timerId);
    timerId = null;
    startBtn.disabled = false;
    return;
  }

  // Aggiorna il testo del countdown
  countdownEl.textContent = formatCountdown(diff);

  // Cambio colore dinamico
  const minutesLeft = diff / 60000; // diff in minuti
  countdownEl.classList.remove("green", "yellow", "red");

  if (minutesLeft > 10) {
    countdownEl.classList.add("green");
  } else if (minutesLeft > 3) {
    countdownEl.classList.add("yellow");
  } else {
    countdownEl.classList.add("red");
  }
}


// =====================================
// 5. AVVIA IL TIMER
// =====================================

function startBreak() {
  if (timerId !== null) return; // evita doppia partenza

  const now = new Date();
  const finish = new Date(now.getTime() + BREAK_DURATION_MS);

  endTime = finish.getTime();

  // Aggiorna UI
  startTimeEl.textContent = formatHHMM(now);
  endTimeEl.textContent = formatHHMM(finish);
  countdownEl.className = "countdown green";
  messageEl.textContent = "";
  startBtn.disabled = true;

  // Avvia il timer
  updateCountdown();
  timerId = setInterval(updateCountdown, 1000);
}


// =====================================
// 6. RESET TIMER
// =====================================

function resetBreak() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }

  countdownEl.textContent = "15:00";
  countdownEl.className = "countdown green";

  startTimeEl.textContent = "--:--";
  endTimeEl.textContent = "--:--";
  messageEl.textContent = "";

  startBtn.disabled = false;
  endTime = null;
}


// =====================================
// 7. EVENT LISTENERS
// =====================================

startBtn.addEventListener("click", startBreak);
resetBtn.addEventListener("click", resetBreak);