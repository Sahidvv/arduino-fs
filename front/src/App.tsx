// src/App.tsx 
import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Bell, Settings, BarChart3 } from 'lucide-react';
import { DashboardCard } from './components/DashboardCard';
import { Chart } from './components/Chart';
import { ReportButton } from './components/ReportButton';
import { wsService } from './services/websocket';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface SensorData {
  timestamp: number;
  temperature: number;
  humidity: number;
}
const TEMPERATURE_THRESHOLD = 26; // Ajusta este valor según tus necesidades

function App() {
  const [data, setData] = useState<SensorData[]>([]);
  const [alertActive, setAlertActive] = useState(false);

  useEffect(() => {
    wsService.connect();
  
    wsService.onData((sensorData: SensorData) => {
      console.log('Received sensor data:', sensorData); // Añadido para depuración
      setData((prev) => {
        const updated = [...prev, sensorData];
        if (updated.length > 100) {
          return updated.slice(-100);
        }
        return updated;
      });
  
      // Verificar si la temperatura supera el umbral
      if (sensorData.temperature >= TEMPERATURE_THRESHOLD) {
        setAlertActive(true);
      } else {
        setAlertActive(false); // Opcional: puedes decidir cuándo desactivar la alerta
      }
    });
  
    return () => wsService.disconnect();
  }, []);
  

  const latestData = data[data.length - 1] || { timestamp: Date.now(), temperature: 0, humidity: 0 };
  const previousData = data[data.length - 2] || { timestamp: Date.now(), temperature: 0, humidity: 0 };

  const tempTrend =
    latestData.temperature > previousData.temperature
      ? 'up'
      : latestData.temperature < previousData.temperature
      ? 'down'
      : undefined;
  const tempTrendValue = tempTrend ? `${Math.abs(latestData.temperature - previousData.temperature).toFixed(1)}°C` : '';

  const humidityTrend =
    latestData.humidity > previousData.humidity
      ? 'up'
      : latestData.humidity < previousData.humidity
      ? 'down'
      : undefined;
  const humidityTrendValue = humidityTrend ? `${Math.abs(latestData.humidity - previousData.humidity).toFixed(1)}%` : '';

  return (
    <div className="min-h-screen bg-gray-50">
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
                  {/* ... botones existentes */}
                </nav>    
              <div className="flex items-center space-x-4">
                    <ReportButton />
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Temperature"
            value={`${latestData.temperature.toFixed(1)}°C`}
            icon={<Thermometer className="w-6 h-6 text-red-500" />}
            trend={tempTrend}
            trendValue={tempTrendValue}
          />
          <DashboardCard
            title="Humidity"
            value={`${latestData.humidity.toFixed(1)}%`}
            icon={<Droplets className="w-6 h-6 text-blue-500" />}
            trend={humidityTrend}
            trendValue={humidityTrendValue}
          />
          <DashboardCard
            title="Sensor Status"
            value="Online"
            icon={<BarChart3 className="w-6 h-6 text-green-500" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Temperature History</h2>
            <Chart data={data} type="temperature" />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Humidity History</h2>
            <Chart data={data} type="humidity" />
          </div>
        </div>
      </main>
      {/* Alerta */}
    {alertActive && (
      <div className="fixed inset-0 flex items-center justify-center bg-red-600 bg-opacity-90 z-50">
        <div className="text-center text-white">
        <AlertTriangle className="w-24 h-24 mx-auto mb-4 animate-pulse" />

          <h2 className="text-4xl font-bold">¡Alerta de Temperatura!</h2>
          <p className="mt-2 text-lg">La temperatura ha superado el umbral seguro.</p>
          {/* Botón para cerrar la alerta  */}
          {/* <button
            onClick={() => setAlertActive(false)}
            className="mt-4 px-4 py-2 bg-white text-red-600 font-semibold rounded"
          >
            Cerrar Alerta
          </button> */}
        </div>
      </div>
    )}
    </div>
  );
}

export default App;
