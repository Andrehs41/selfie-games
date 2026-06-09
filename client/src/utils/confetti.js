import confetti from 'canvas-confetti';

// Lluvia de confeti en tonos pastel (para premios / trivia perfecta).
const PASTEL = ['#E8B4B8', '#C8A98F', '#A8C3A2', '#F0D9C7', '#D9A06B'];

export function celebrate() {
  const end = Date.now() + 1200;
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0 },
      colors: PASTEL,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1 },
      colors: PASTEL,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors: PASTEL });
}
