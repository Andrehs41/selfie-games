// Preguntas de la trivia. `correct` es el índice (0-based) de la opción correcta.
// NUNCA se envía `correct` al cliente: la respuesta se valida en el backend.
export const TRIVIA_QUESTIONS = [
  {
    id: 1,
    question: '¿Cuántos años llevamos en el mercado?',
    options: ['2', '4', '5', '6'],
    correct: 2,
  },
  {
    id: 2,
    question: '¿Qué productos lanzamos en Expobelleza 2025?',
    options: [
      'Mascarilla Capilar y Perfume de Coco',
      'Perfume de Candy y Kit Viajero',
      'Perfume de Sandía y Tónico Capilar',
      'Shampoo For Men y Mascarilla',
    ],
    correct: 1,
  },
  {
    id: 3,
    question: '¿Cuál es el nuevo integrante de nuestra familia de productos?',
    options: ['Shampoo For Men', 'Aceite para Puntas', 'Crema para Peinar', 'Tónico capilar'],
    correct: 3,
  },
  {
    id: 4,
    question:
      '¿Qué beneficio especial tiene el Perfume Capilar de By Mariana Zapata además del aroma?',
    options: [
      'Tintura temporal y volumen',
      'Biotina, filtro UV y termoprotector',
      'Keratina líquida y efecto alisador',
      'Aceite de coco y control del frizz',
    ],
    correct: 1,
  },
  {
    id: 5,
    question: '¿Cuántos pasos tiene la Rutina Anti-Caída del Kit Fuerza Capilar?',
    options: ['2 pasos', '3 pasos', '5 pasos', '4 pasos'],
    correct: 3,
  },
  {
    id: 6,
    question: '¿En qué fragancias viene disponible el perfume capilar?',
    options: [
      'Fresa, mango y coco',
      'Fresa, vainilla y sandía',
      'Sandía, Coco y Candy',
      'Miel, Piña y Candy',
    ],
    correct: 2,
  },
  {
    id: 7,
    question: '¿Cómo se llama la comunidad de seguidoras de By Mariana Zapata?',
    options: ['Marifans', 'Marilovers', 'Mariqueens', 'Marigirls'],
    correct: 1,
  },
  {
    id: 8,
    question: '¿Cuál de estas frutas NO aparece como ingrediente en la Mascarilla Multinutritiva?',
    options: ['Piña', 'Papaya', 'Banano', 'Mango'],
    correct: 3,
  },
];

// Fisher-Yates: devuelve una copia mezclada.
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Vista pública: preguntas y opciones EN ORDEN ALEATORIO (anti-trampa).
// Cada opción lleva su índice original como `id`; la validación en el backend
// compara ese id contra la respuesta correcta, así que mezclar no la rompe ni
// revela cuál es la correcta.
export function publicQuestions() {
  const questions = TRIVIA_QUESTIONS.map(({ id, question, options }) => ({
    id,
    question,
    options: shuffle(options.map((text, idx) => ({ id: idx, text }))),
  }));
  return shuffle(questions);
}
