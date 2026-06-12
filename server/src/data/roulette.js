// Segmentos de la ruleta (orden = posición física en la rueda).
// `type`: 'win' = premio | 'retry' = sigue intentando.
// `weight`: probabilidad relativa. Ajustable para controlar el % de cada
// categoría sin tocar el resto del código.
// Orden = posición física en la rueda. Los 3 "Sigue intentando" se intercalan
// (posiciones 2, 5 y 8) para que queden repartidos y no en un mismo bloque.
//
// Distribución pedida por el cliente (suma de pesos = 300), por PREMIO:
//   • Sigue intentando (×3)   → peso 65 c/u → 195/300 = 65%
//   • Bonos 20% Off (×2)      → peso 30 c/u →  60/300 = 20%
//   • Shampoo + Acondicionador → peso 21 c/u →  42/300 = 14% (7% c/u)
//   • Kit Viajero (×1)        → peso 3       →   3/300 = 1% (hay pocos)
const ROULETTE_SEGMENTS = [
  { id: 1, label: 'Shampoo Viajero', type: 'win', weight: 21 },
  { id: 2, label: 'Sigue intentando', type: 'retry', weight: 65 },
  { id: 3, label: 'Acondicionador Viajero', type: 'win', weight: 21 },
  { id: 4, label: 'Bono 20% Off', type: 'win', weight: 30 },
  { id: 5, label: 'Sigue intentando', type: 'retry', weight: 65 },
  { id: 6, label: 'Kit Viajero', type: 'win', weight: 3 },
  { id: 7, label: 'Bono 20% Off', type: 'win', weight: 30 },
  { id: 8, label: 'Sigue intentando', type: 'retry', weight: 65 },
];

// Vista pública (sin pesos) para que el front dibuje la rueda.
function publicSegments() {
  return ROULETTE_SEGMENTS.map(({ id, label, type }) => ({ id, label, type }));
}

// El servidor decide el segmento ganador según los pesos.
function pickSegmentIndex() {
  const total = ROULETTE_SEGMENTS.reduce((sum, s) => sum + s.weight, 0);
  let r = Math.random() * total;
  for (let i = 0; i < ROULETTE_SEGMENTS.length; i++) {
    r -= ROULETTE_SEGMENTS[i].weight;
    if (r < 0) return i;
  }
  return ROULETTE_SEGMENTS.length - 1;
}

module.exports = { ROULETTE_SEGMENTS, publicSegments, pickSegmentIndex };
