import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';

const WWW_DIR = path.resolve('www');
const EVIDENCIAS_DIR = path.resolve('evidencias');

if (!fs.existsSync(EVIDENCIAS_DIR)) {
  fs.mkdirSync(EVIDENCIAS_DIR, { recursive: true });
}

// Servidor HTTP simple para la SPA en www
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  let filePath = path.join(WWW_DIR, reqPath === '/' ? 'index.html' : reqPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(WWW_DIR, 'index.html'); // fallback SPA
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(3456, async () => {
  console.log('Servidor estático corriendo en http://localhost:3456');

  try {
    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

    console.log('Capturando pantalla 1: Login...');
    await page.goto('http://localhost:3456/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(EVIDENCIAS_DIR, '01_login_interfaz.png'), fullPage: true });

    console.log('Capturando pantalla 2: Cuadro de Mando (Admin)...');
    await page.goto('http://localhost:3456/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500); // esperar a que renderice Chart.js
    await page.screenshot({ path: path.join(EVIDENCIAS_DIR, '02_dashboard_admin_chart.png'), fullPage: true });

    console.log('Capturando pantalla 3: Alta de Registros (Formulario Reactivo)...');
    await page.goto('http://localhost:3456/registros', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(EVIDENCIAS_DIR, '03_alta_formulario_reactivo.png'), fullPage: true });

    console.log('Capturando pantalla 4: Inventario (Tabla Componente Reutilizable)...');
    // Pulsamos en la pestaña de inventario
    const listTab = page.locator('ion-segment-button[value="listado"]');
    if (await listTab.isVisible()) {
      await listTab.click();
      await page.waitForTimeout(800);
    }
    await page.screenshot({ path: path.join(EVIDENCIAS_DIR, '04_inventario_tabla_avanzada.png'), fullPage: true });

    console.log('Capturando pantalla 5: Manual de Usuario & Ayuda...');
    await page.goto('http://localhost:3456/ayuda', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(EVIDENCIAS_DIR, '05_manual_ayuda_embebido.png'), fullPage: true });

    console.log('Capturando pantalla 6: Error 403 No Autorizado...');
    await page.goto('http://localhost:3456/unauthorized', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(EVIDENCIAS_DIR, '06_error_403_unauthorized.png'), fullPage: true });

    // Captura móvil responsiva (Mobile-First)
    console.log('Capturando pantalla 7: Vista Móvil Responsive...');
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14
    await page.goto('http://localhost:3456/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(EVIDENCIAS_DIR, '07_vista_movil_responsive.png'), fullPage: true });

    console.log('¡Todas las capturas generadas con éxito en /evidencias!');
    await browser.close();
  } catch (error) {
    console.error('Error al capturar pantallas:', error);
  } finally {
    server.close();
  }
});
