import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const HEADERS = ['Nombre', 'Email', 'Teléfono', 'Registrado', 'Trivia', 'Ruleta'];

function fmtDate(d) {
  return d ? new Date(d).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) : '';
}

function rowValues(u) {
  return [
    u.nombre,
    u.email,
    u.telefono,
    fmtDate(u.createdAt),
    u.trivia?.played ? `${u.trivia.score}/${u.trivia.total}` : 'No jugó',
    u.ruleta?.played ? u.ruleta.prizeLabel : 'No jugó',
  ];
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Exporta los usuarios (ya filtrados en pantalla) a CSV.
export function exportCsv(users) {
  const cell = (v) => {
    const s = v === undefined || v === null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv =
    '﻿' + [HEADERS.join(','), ...users.map((u) => rowValues(u).map(cell).join(','))].join('\n');
  download(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), 'leads-selfie-games.csv');
}

// Exporta los usuarios (ya filtrados en pantalla) a PDF.
export function exportPdf(users) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text('Leads — By Mariana Zapata', 14, 15);
  doc.setFontSize(9);
  doc.setTextColor(140);
  doc.text(`Generado: ${new Date().toLocaleString('es-CO')} · ${users.length} registros`, 14, 21);
  autoTable(doc, {
    head: [HEADERS],
    body: users.map(rowValues),
    startY: 26,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [200, 169, 143], textColor: 50 },
    alternateRowStyles: { fillColor: [251, 244, 236] },
  });
  doc.save('leads-selfie-games.pdf');
}
