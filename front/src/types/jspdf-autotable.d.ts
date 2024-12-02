import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head?: Array<Array<string | number>>;
      body: Array<Array<string | number>>;
      startY?: number;
      theme?: 'striped' | 'grid' | 'plain';
      styles?: {
        fontSize?: number;
        cellPadding?: number;
        fillColor?: [number, number, number];
        textColor?: [number, number, number];
      };
      headStyles?: {
        fontSize?: number;
        fillColor?: [number, number, number];
        textColor?: [number, number, number];
      };
      bodyStyles?: {
        fontSize?: number;
        fillColor?: [number, number, number];
        textColor?: [number, number, number];
      };
    }) => void;
  }
}
