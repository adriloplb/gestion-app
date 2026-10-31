import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';

const MANUAL_MD = path.resolve('MANUAL_DE_USUARIO.md');
const ANEXO_MD = path.resolve('ANEXO_SEGURIDAD.md');
const EVIDENCIAS_DIR = path.resolve('evidencias');

function getBase64Image(filename) {
  const filePath = path.join(EVIDENCIAS_DIR, filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  return '';
}

function mdToHtml(mdText, title, subtitle) {
  // Conversión simple y limpia de markdown a HTML estructurado
  let lines = mdText.split('\n');
  let html = '';
  let inList = false;
  let inTable = false;
  let tableHeaderDone = false;

  for (let line of lines) {
    let trimmed = line.trim();

    // Título h1 (# )
    if (trimmed.startsWith('# ')) {
      html += `<h1 class="doc-title">${trimmed.substring(2)}</h1>`;
      continue;
    }
    // Título h2 (## )
    if (trimmed.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false; }
      if (inTable) { html += '</tbody></table>'; inTable = false; }
      html += `<h2 class="section-h2">${trimmed.substring(3)}</h2>`;
      continue;
    }
    // Título h3 (### )
    if (trimmed.startsWith('### ')) {
      if (inList) { html += '</ul>'; inList = false; }
      if (inTable) { html += '</tbody></table>'; inTable = false; }
      html += `<h3 class="section-h3">${trimmed.substring(4)}</h3>`;
      continue;
    }
    // Separador horizontal (---)
    if (trimmed === '---') {
      if (inList) { html += '</ul>'; inList = false; }
      if (inTable) { html += '</tbody></table>'; inTable = false; }
      html += '<hr class="doc-divider">';
      continue;
    }
    // Tabla markdown (| ... |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (inList) { html += '</ul>'; inList = false; }
      let cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
      // Si es la fila de guiones (|:---|)
      if (cells.every(c => c.match(/^:?-+:?$/))) {
        continue;
      }
      if (!inTable) {
        html += '<table class="content-table"><thead><tr>';
        cells.forEach(c => html += `<th>${formatInline(c)}</th>`);
        html += '</tr></thead><tbody>';
        inTable = true;
        tableHeaderDone = true;
      } else {
        html += '<tr>';
        cells.forEach(c => html += `<td>${formatInline(c)}</td>`);
        html += '</tr>';
      }
      continue;
    } else if (inTable) {
      html += '</tbody></table>';
      inTable = false;
    }

    // Listas con viñetas (* o -)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      if (!inList) { html += '<ul class="content-list">'; inList = true; }
      html += `<li>${formatInline(trimmed.substring(2))}</li>`;
      continue;
    } else if (inList && trimmed === '') {
      html += '</ul>';
      inList = false;
      continue;
    }

    // Párrafo normal
    if (trimmed !== '') {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<p>${formatInline(trimmed)}</p>`;
    }
  }

  if (inList) html += '</ul>';
  if (inTable) html += '</tbody></table>';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page {
      size: A4;
      margin: 22mm 18mm 22mm 18mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9.5pt;
      line-height: 1.5;
      color: #1e293b;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }
    .doc-title {
      font-size: 20pt;
      font-weight: 800;
      color: #0f172a;
      margin: 4mm 0 2mm 0;
      letter-spacing: -0.01em;
    }
    .section-h2 {
      font-size: 13pt;
      font-weight: 700;
      color: #0f172a;
      margin: 16px 0 6px 0;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 3px;
      page-break-after: avoid;
    }
    .section-h3 {
      font-size: 10.5pt;
      font-weight: 700;
      color: #2563eb;
      margin: 12px 0 4px 0;
      page-break-after: avoid;
    }
    p {
      margin: 0 0 8px 0;
      text-align: justify;
      color: #334155;
    }
    .doc-divider {
      border: 0;
      height: 1px;
      background: #e2e8f0;
      margin: 14px 0;
    }
    .content-list {
      margin: 0 0 10px 0;
      padding-left: 20px;
      color: #334155;
    }
    .content-list li {
      margin-bottom: 4px;
    }
    .content-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px 0;
      font-size: 8.5pt;
    }
    .content-table th, .content-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 9px;
      text-align: left;
    }
    .content-table th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
    }
    .content-table tr:nth-child(even) {
      background: #f8fafc;
    }
    code {
      background: #f1f5f9;
      color: #0f172a;
      padding: 2px 5px;
      border-radius: 4px;
      font-family: Consolas, monospace;
      font-size: 8.5pt;
      border: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
}

function formatInline(text) {
  // **bold**
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // *italic*
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // `code`
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  return text;
}

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const headerHtml = `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 9.5pt; width: 100%; margin: 0 18mm; border-bottom: 1px solid #000000; padding-bottom: 3px; display: flex; justify-content: space-between; color: #000000; box-sizing: border-box;">
      <span style="font-weight: 500;">Adrián López Delgado</span>
      <span style="font-weight: 500;">2º DAM</span>
    </div>
  `;

  const footerHtml = `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 9.5pt; width: 100%; margin: 0 18mm; border-top: 1px solid #cbd5e1; padding-top: 3px; display: flex; justify-content: flex-end; color: #334155; box-sizing: border-box;">
      <span class="pageNumber"></span>
    </div>
  `;

  // 1. Manual de Usuario
  console.log('Generando Manual_de_Usuario_Adrian_Lopez_Delgado.pdf...');
  const manualMd = fs.readFileSync(MANUAL_MD, 'utf-8');
  const manualHtml = mdToHtml(manualMd, 'Manual de Usuario - Sistema de Gestión', 'Adrián López Delgado');
  const page1 = await browser.newPage();
  await page1.setContent(manualHtml, { waitUntil: 'load' });
  await page1.pdf({
    path: path.resolve('Manual_de_Usuario_Adrian_Lopez_Delgado.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '22mm', bottom: '22mm', left: '18mm', right: '18mm' },
    displayHeaderFooter: true,
    headerTemplate: headerHtml,
    footerTemplate: footerHtml
  });
  await page1.close();

  // 2. Anexo de Seguridad
  console.log('Generando Anexo_de_Seguridad_Adrian_Lopez_Delgado.pdf...');
  const anexoMd = fs.readFileSync(ANEXO_MD, 'utf-8');
  const anexoHtml = mdToHtml(anexoMd, 'Anexo Técnico de Seguridad', 'Adrián López Delgado');
  const page2 = await browser.newPage();
  await page2.setContent(anexoHtml, { waitUntil: 'load' });
  await page2.pdf({
    path: path.resolve('Anexo_de_Seguridad_Adrian_Lopez_Delgado.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '22mm', bottom: '22mm', left: '18mm', right: '18mm' },
    displayHeaderFooter: true,
    headerTemplate: headerHtml,
    footerTemplate: footerHtml
  });
  await page2.close();

  await browser.close();
  console.log('¡Manual de Usuario y Anexo de Seguridad generados con éxito en PDF!');
}

run().catch(err => {
  console.error('Error generando PDFs adicionales:', err);
  process.exit(1);
});

