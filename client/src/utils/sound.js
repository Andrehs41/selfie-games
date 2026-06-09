// Sonidos sintetizados con la Web Audio API (sin archivos externos).
// El AudioContext se crea/reanuda dentro de un gesto del usuario (el click de
// "Girar"), que es lo que exigen los navegadores.

let ctx = null;

function audioCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// Asegura que el contexto esté activo (llamar en el click del usuario).
export function primeAudio() {
  audioCtx();
}

// "Tic" corto, como el palito de una ruleta al pasar un segmento.
export function playTick() {
  const c = audioCtx();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(1200, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.12, t + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.06);
}

// Pequeño arpegio alegre al ganar un premio.
export function playWin() {
  const c = audioCtx();
  if (!c) return;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // Do-Mi-Sol-Do
  notes.forEach((freq, i) => {
    const t = c.currentTime + i * 0.12;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  });
}
