// src/pages/DataPage.tsx
import { useEffect, useState } from 'react';
import { fetchData } from '../services/api';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Bell, Settings } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { es } from 'date-fns/locale'; 
import 'react-datepicker/dist/react-datepicker.css';
import { DownloadPDFButton } from '../components/DownloadPDFButton'; 

interface SensorData {
  timestamp: number;
  temperature: number;
  humidity: number;
}

function DataPage() {
  const [data, setData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [error, setError] = useState<string | null>(null); 

  const fetchStoredData = async () => {
    if (!startDate || !endDate) {
      console.error('Las fechas no son válidas');
      setError('Por favor, selecciona ambas fechas.');
      return;
    }

    setIsLoading(true);
    setError(null); 
    try {
      const start = startDate.getTime();
      const end = endDate.getTime();
      console.log('Fetching data from', start, 'to', end);
      const response = await fetchData(start, end);
      console.log('Received data:', response);
      setData(response);
    } catch (error) {
      console.error('Error fetching stored data:', error);
      setError('Error al cargar los datos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStoredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold text-gray-900">Environmental Monitor</h1>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link to="/data" className="text-gray-600 hover:text-gray-800">
                Datos Almacenados
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center py-8">
        <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          {/* Filtros */}
          <div className="flex items-center space-x-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date ?? undefined)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd/MM/yyyy"
                locale={es}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha Fin</label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date ?? undefined)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd/MM/yyyy"
                locale={es}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <button
              onClick={fetchStoredData}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Filtrar
            </button>
          </div>

            {/* Botón para descargar PDF */}
            <div className="flex justify-end mb-4">
            <DownloadPDFButton data={data} />
          </div>
          
          {/* Título */}
          <h1 className="text-2xl font-bold mb-4">Datos Almacenados</h1>

          {/* Manejo de estados: Cargando, Error, Datos */}
          {isLoading ? (
            <p>Cargando datos...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha y Hora</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Temperatura (°C)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Humedad (%)</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                      No hay datos para mostrar.
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.timestamp} className="border-b">
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {format(new Date(item.timestamp), 'dd/MM/yyyy HH:mm:ss')}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">{item.temperature.toFixed(1)}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{item.humidity.toFixed(1)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <footer className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Grupo 3 - IOT - Proyecto Arduino Web</p>
        </div>
      </footer>
    </div>
  );
}

export default DataPage;
