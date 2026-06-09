import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const HEADERS = ['Nombre', 'Teléfono', 'Registrado', 'Trivia', 'Ruleta'];

function fmtDate(d) {
  return d ? new Date(d).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) : '';
}

function rowValues(p) {
  return [
    p.nombre,
    p.telefono,
    fmtDate(p.createdAt),
    p.trivia?.played ? `${p.trivia.score}/${p.trivia.total}` : 'No jugó',
    p.ruleta?.played ? p.ruleta.prizeLabel : 'No jugó',
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

// Exporta los participantes (ya filtrados en pantalla) a CSV.
export function exportCsv(rows) {
  const cell = (v) => {
    const s = v === undefined || v === null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = '﻿' + [HEADERS.join(','), ...rows.map((p) => rowValues(p).map(cell).join(','))].join('\n');
  download(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), 'leads-selfie-games.csv');
}

// Exporta los participantes (ya filtrados en pantalla) a PDF.
export function exportPdf(rows) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text('Leads — By Mariana Zapata', 14, 15);
  doc.setFontSize(9);
  doc.setTextColor(140);
  doc.text(`Generado: ${new Date().toLocaleString('es-CO')} · ${rows.length} registros`, 14, 21);
  autoTable(doc, {
    head: [HEADERS],
    body: rows.map(rowValues),
    startY: 26,
    styles: { fontSize: 9, cellPadding: 2.5 },
    headStyles: { fillColor: [236, 14, 142], textColor: 255 },
    alternateRowStyles: { fillColor: [250, 243, 230] },
  });
  doc.save('leads-selfie-games.pdf');
}
