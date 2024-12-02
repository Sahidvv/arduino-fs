// src/utils/reportGenerator.ts
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

interface DailyReportData {
  date: string; // ISO string
  avg_temperature: number;
  max_temperature: number;
  min_temperature: number;
  avg_humidity: number;
  max_humidity: number;
  min_humidity: number;
}

export const generatePDF = (data: DailyReportData[]) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Environmental Monitoring Report', 14, 22);
  doc.setFontSize(12);
  doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 32);

  const tableData = data.map(row => [
    format(new Date(row.date), 'PP'),
    `${row.avg_temperature.toFixed(1)}°C`,
    `${row.max_temperature.toFixed(1)}°C`,
    `${row.min_temperature.toFixed(1)}°C`,
    `${row.avg_humidity.toFixed(1)}%`,
    `${row.max_humidity.toFixed(1)}%`,
    `${row.min_humidity.toFixed(1)}%`
  ]);

  doc.autoTable({
    head: [['Date', 'Avg Temp', 'Max Temp', 'Min Temp', 'Avg Humidity', 'Max Humidity', 'Min Humidity']],
    body: tableData,
    startY: 40,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] }
  });

  doc.save('environmental-report.pdf');
};
