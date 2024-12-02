// src/utils/sensorReportGenerator.ts
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export interface SensorData {
  timestamp: number;
  temperature: number;
  humidity: number;
}

export const generateSensorDataPDF = (data: SensorData[]) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.text('Reporte de Datos de Sensores', 14, 22);
  doc.setFontSize(12);
  doc.text(`Generado el: ${format(new Date(), 'PPpp')}`, 14, 32);

  // Preparar datos para la tabla
  const tableData = data.map(item => [
    format(new Date(item.timestamp), 'dd/MM/yyyy HH:mm:ss'),
    `${item.temperature.toFixed(1)}°C`,
    `${item.humidity.toFixed(1)}%`
  ]);

  // Configuración de la tabla
  doc.autoTable({
    head: [['Fecha y Hora', 'Temperatura (°C)', 'Humedad (%)']],
    body: tableData,
    startY: 40,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 139, 202] }
  });

  // Descargar el PDF
  doc.save('reporte-datos-sensores.pdf');
};
