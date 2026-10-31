import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({ providedIn: 'root' })
export class ExportService {

  /**
   * Exporta un conjunto de datos a formato CSV compatible con Microsoft Excel y hojas de cálculo.
   * Incluye Byte Order Mark (BOM) UTF-8 para garantizar la visualización de tildes y símbolos (€).
   */
  exportToCsv(filename: string, rows: Record<string, any>[]): void {
    if (!rows || !rows.length) {
      console.warn('No hay registros para exportar a CSV.');
      return;
    }

    const separator = ';'; // Separador europeo por defecto para Excel
    const keys = Object.keys(rows[0]);
    const headerRow = keys.join(separator);

    const dataRows = rows.map(row => {
      return keys
        .map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date ? cell.toLocaleString('es-ES') : cell.toString();
          // Escapar comillas dobles
          cell = cell.replace(/"/g, '""');
          if (cell.search(/("|\n|;)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        })
        .join(separator);
    });

    const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Genera y descarga un informe ejecutivo en PDF con diseño profesional,
   * cabecera institucional, metadata, tabla con rejilla de estilos y paginación.
   */
  exportToPdf(
    title: string,
    headers: string[],
    data: (string | number)[][],
    filename: string,
    subheading: string = 'FP Nebrija Madrid - Módulo Desarrollo de Interfaces'
  ): void {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. Barra superior corporativa (Azul primario)
    doc.setFillColor(56, 128, 255);
    doc.rect(0, 0, pageWidth, 22, 'F');

    // 2. Título y subtítulo en blanco
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(title, 14, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(subheading, 14, 18);

    // 3. Metadatos del informe
    const fechaEmision = new Date().toLocaleString('es-ES');
    doc.text(`Fecha: ${fechaEmision}`, pageWidth - 14, 12, { align: 'right' });
    doc.text('Estado: Oficial / Consolidado', pageWidth - 14, 18, { align: 'right' });

    // 4. Tabla de datos tabulada estilizada
    autoTable(doc, {
      startY: 28,
      head: [headers],
      body: data,
      theme: 'striped',
      headStyles: {
        fillColor: [34, 46, 60],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'left'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3.5,
        valign: 'middle'
      },
      alternateRowStyles: {
        fillColor: [247, 249, 252]
      },
      didDrawPage: (dataArg) => {
        // Pie de página institucional en cada página
        doc.setFontSize(8);
        doc.setTextColor(130, 140, 150);
        doc.text(
          'Sistema de Gestión Multiplataforma Nebrija - Documento Confidencial de Auditoría',
          14,
          pageHeight - 8
        );
        doc.text(
          `Página ${dataArg.pageNumber}`,
          pageWidth - 14,
          pageHeight - 8,
          { align: 'right' }
        );
      }
    });

    doc.save(`${filename}_${new Date().toISOString().slice(0, 10)}.pdf`);
  }
}
