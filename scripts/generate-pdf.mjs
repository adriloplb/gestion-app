import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';

const EVIDENCIAS_DIR = path.resolve('evidencias');
const TEMPLATE_FILE = path.resolve('scripts', 'memoria-template.html');
const OUTPUT_PDF = path.resolve('Memoria_Proyecto_Adrian_Lopez_Delgado.pdf');
const ARTIFACTS_PDF = path.resolve('C:\\Users\\delga\\.gemini\\antigravity\\brain\\13dc7955-49e4-4c70-a50c-f2df9e7a7292\\Memoria_Proyecto_Adrian_Lopez_Delgado.pdf');

function getBase64Image(filename) {
  const filePath = path.join(EVIDENCIAS_DIR, filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  return '';
}

async function generatePdf() {
  console.log('Cargando plantilla HTML y evidencias visuales...');
  let html = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

  html = html.replace('{{IMG_LOGIN}}', getBase64Image('01_login_interfaz.png'));
  html = html.replace('{{IMG_DASHBOARD}}', getBase64Image('02_dashboard_admin_chart.png'));
  html = html.replace('{{IMG_ALTA}}', getBase64Image('03_alta_formulario_reactivo.png'));
  html = html.replace('{{IMG_INVENTARIO}}', getBase64Image('04_inventario_tabla_avanzada.png'));
  html = html.replace('{{IMG_AYUDA}}', getBase64Image('05_manual_ayuda_embebido.png'));
  html = html.replace('{{IMG_UNAUTHORIZED}}', getBase64Image('06_error_403_unauthorized.png'));
  html = html.replace('{{IMG_MOBILE}}', getBase64Image('07_vista_movil_responsive.png'));

  console.log('Iniciando Chromium...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(1000); // Dar margen para el renderizado completo

  console.log('Generando documento PDF oficial...');
  await page.pdf({
    path: OUTPUT_PDF,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '22mm',
      bottom: '22mm',
      left: '18mm',
      right: '18mm'
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-family: Arial, Helvetica, sans-serif; font-size: 9.5pt; width: 100%; margin: 0 18mm; border-bottom: 1px solid #000000; padding-bottom: 3px; display: flex; justify-content: space-between; color: #000000; box-sizing: border-box;">
        <span style="font-weight: 500;">Adrián López Delgado</span>
        <span style="font-weight: 500;">2º DAM</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: Arial, Helvetica, sans-serif; font-size: 9.5pt; width: 100%; margin: 0 18mm; border-top: 1px solid #cbd5e1; padding-top: 3px; display: flex; justify-content: flex-end; color: #334155; box-sizing: border-box;">
        <span class="pageNumber"></span>
      </div>
    `
  });

  await browser.close();

  // Copiamos a la carpeta de artefactos
  fs.copyFileSync(OUTPUT_PDF, ARTIFACTS_PDF);
  console.log('PDF generado exitosamente: ' + OUTPUT_PDF);
  console.log('PDF copiado a artefactos: ' + ARTIFACTS_PDF);
}

generatePdf().catch(err => {
  console.error('Error generando PDF:', err);
  process.exit(1);
});
