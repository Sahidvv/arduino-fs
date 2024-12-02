// server/index.js
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import mysql from 'mysql2/promise';
import cron from 'node-cron';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
  try {
    console.log('Conectando a la base de datos...');
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('Conexión exitosa:', rows);
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    process.exit(1); 
  }
})();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// Configurar el puerto serial
const serialPort = new SerialPort({
  path: process.env.SERIAL_PORT || 'COM3',
  baudRate: 9600,
});

const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));
const isValidData = (temperature, humidity) => {
  return (
    typeof temperature === 'number' &&
    typeof humidity === 'number' &&
    temperature >= -50 && temperature <= 100 &&
    humidity >= 0 && humidity <= 100
  );
};
parser.on('data', async (line) => {
  try {
    console.log(`Datos recibidos del Arduino: ${line}`);
    const data = JSON.parse(line);
    const { temperature, humidity } = data;
    const timestamp = new Date();

    if (!isValidData(temperature, humidity)) {
      console.error('Datos inválidos recibidos:', data);
      return;
    }

    // Insertar datos en la base de datos
    const query = 'INSERT INTO sensor_data (timestamp, temperature, humidity) VALUES (?, ?, ?)';
    await pool.execute(query, [timestamp, temperature, humidity]);

    // Preparar datos para WebSocket
    const broadcastData = {
      timestamp: timestamp.getTime(),
      temperature,
      humidity,
    };

    // Enviar datos a todos los clientes WebSocket conectados
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(broadcastData));
      }
    });

    console.log(`Datos almacenados y enviados: ${JSON.stringify(broadcastData)}`);
  } catch (error) {
    console.error('Error al procesar los datos del Arduino:', error.message);
  }
});

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

// Endpoints REST
app.get('/api/data', async (req, res) => {
  try {
    const { start, end, limit = 50, offset = 0 } = req.query;

    if (!start || !end) {
      console.log('Parámetros faltantes: start y end son requeridos');
      return res.status(400).json({ error: 'Parámetros start y end son requeridos' });
    }

    console.log('Parámetros recibidos:', { start, end, limit, offset });

    const startDateObj = new Date(parseInt(start, 10));
    const endDateObj = new Date(parseInt(end, 10));

    console.log('Fechas parseadas:', { startDateObj, endDateObj });

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      console.log('Fechas inválidas:', { startDateObj, endDateObj });
      return res.status(400).json({ error: 'Fechas inválidas' });
    }

    const startDate = startDateObj;
    const endDate = endDateObj;

    let limitNumber = parseInt(limit, 10);
    let offsetNumber = parseInt(offset, 10);

    if (isNaN(limitNumber) || limitNumber <= 0) {
      limitNumber = 50; 
    }

    if (isNaN(offsetNumber) || offsetNumber < 0) {
      offsetNumber = 0; 
    }

    console.log('Limit y Offset después de parsear:', { limitNumber, offsetNumber });

    const query = `SELECT * FROM sensor_data WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp DESC LIMIT ${limitNumber} OFFSET ${offsetNumber}`;

    const [rows] = await pool.execute(query, [
      startDate,
      endDate,
    ]);

    console.log(`Consulta ejecutada exitosamente. Registros encontrados: ${rows.length}`);

    res.json(rows);

  } catch (error) {
    console.error('Error en el endpoint /api/data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/reports/daily', async (req, res) => {
  try {
    const query = `
      SELECT 
        DATE(timestamp) as date,
        AVG(temperature) as avg_temperature,
        MAX(temperature) as max_temperature,
        MIN(temperature) as min_temperature,
        AVG(humidity) as avg_humidity,
        MAX(humidity) as max_humidity,
        MIN(humidity) as min_humidity
      FROM sensor_data
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
      LIMIT 30
    `;
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Función para purgar datos antiguos (más de 30 días)
const purgeOldData = async () => {
  try {
    const query = 'DELETE FROM sensor_data WHERE timestamp < NOW() - INTERVAL 30 DAY';
    await pool.execute(query);
    console.log('Datos antiguos purgados exitosamente.');
  } catch (error) {
    console.error('Error al purgar datos antiguos:', error.message);
  }
};

// Programar la purga de datos diariamente a medianoche
cron.schedule('0 0 * * *', purgeOldData); 

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Manejo de errores del puerto serial
serialPort.on('error', (err) => {
  console.error('Error en el puerto serial:', err.message);
});
