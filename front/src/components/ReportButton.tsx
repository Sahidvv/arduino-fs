// src/components/ReportButton.tsx
import { Download } from 'lucide-react';
import { fetchDailyReport } from '../services/api';
import { generatePDF } from '../utils/reportGenerator';
import { useState } from 'react';

export function ReportButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchDailyReport();
      generatePDF(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error generating report:', err.message);
        setError('Failed to generate report.');
      } else {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleGenerateReport}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Download className="w-5 h-5" />
        {isLoading ? 'Generating...' : 'Generate Report'}
      </button>
      {error && <span className="ml-2 text-red-500 text-sm">{error}</span>}
    </div>
  );
}
