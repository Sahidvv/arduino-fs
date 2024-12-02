// src/components/Chart.tsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

interface ChartProps {
  data: SensorData[];
  type: 'temperature' | 'humidity';
}

interface SensorData {
  timestamp: number;
  temperature: number;
  humidity: number;
}

export const Chart: React.FC<ChartProps> = React.memo(({ data, type }) => {
  // Formatear los datos para Recharts
  const formattedData = data.map(item => ({
    time: format(new Date(item.timestamp), 'HH:mm:ss'),
    temperature: item.temperature,
    humidity: item.humidity,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis
          yAxisId="left"
          domain={['auto', 'auto']}
          label={{ value: '°C', angle: -90, position: 'insideLeft' }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={['auto', 'auto']}
          label={{ value: '%', angle: 90, position: 'insideRight' }}
        />
        <Tooltip />
        <Legend
          verticalAlign="top"
          height={36}
          wrapperStyle={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        />
        {type === 'temperature' && (
          <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ef4444" dot={false} />
        )}
        {type === 'humidity' && (
          <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#3b82f6" dot={false} />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
});
