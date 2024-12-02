// src/components/DownloadPDFButton.tsx
import { Download } from 'lucide-react';
import { generateSensorDataPDF, SensorData } from '../utils/sensorReportGenerator';
import { useState } from 'react';

interface DownloadPDFButtonProps {
  data: SensorData[];
}

export function DownloadPDFButton({ data }: DownloadPDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = () => {
    if (data.length === 0) {
      setError('No hay datos para descargar.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      generateSensorDataPDF(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error generando el PDF:', err.message);
        setError('Error al generar el PDF.');
      } else {
        console.error('Error inesperado generando el PDF:', err);
        setError('Error inesperado al generar el PDF.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Download className="w-5 h-5" />
        {isLoading ? 'Descargando...' : 'Descargar PDF'}
      </button>
      {error && <span className="ml-2 text-red-500 text-sm">{error}</span>}
    </div>
  );
}
