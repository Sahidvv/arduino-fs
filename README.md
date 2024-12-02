# Proyecto: Sistema Web de Monitoreo de Temperatura y Humedad

## Descripción del Proyecto / Project Description

**Español:**
Este proyecto consiste en un sistema web desarrollado con React y Node.js, que recibe datos de temperatura y humedad desde un dispositivo Arduino. Los datos se almacenan en una base de datos para visualización en tiempo real, y permite la generación de reportes en formato PDF filtrados por fechas específicas. La funcionalidad requiere un Arduino físico que esté conectado para capturar datos en tiempo real.

**English:**
This project is a web system developed with React and Node.js that receives temperature and humidity data from an Arduino device. The data is stored in a database for real-time visualization, and the system provides PDF report generation filtered by specific date ranges. Functionality requires a physical Arduino connected to capture real-time data.

## Tecnologías Utilizadas / Technologies Used

### Backend
- **Node.js**: El backend se ha desarrollado utilizando Node.js para gestionar el servidor y las comunicaciones con el Arduino y la base de datos.
- **Dependencias**:
  - `express`: Para crear la API REST que maneja las solicitudes del front-end.
  - `mysql2` / `pg`: Para conectarse a la base de datos, soportando MySQL o PostgreSQL.
  - `serialport`: Para comunicarse con el Arduino y leer datos desde los puertos seriales.
  - `dotenv`: Gestión de variables de entorno.
  - `node-cron`: Programación de tareas automáticas.

**English:**
- **Node.js**: The backend is developed using Node.js to manage the server and communication with Arduino and the database.
- **Dependencies**:
  - `express`: To create the REST API that handles requests from the front-end.
  - `mysql2` / `pg`: To connect to the database, supporting MySQL or PostgreSQL.
  - `serialport`: To communicate with Arduino and read data from serial ports.
  - `dotenv`: Environment variable management.
  - `node-cron`: Scheduling automatic tasks.

### Frontend
- **React**: El frontend está desarrollado utilizando React para proporcionar una interfaz de usuario moderna e interactiva.
- **Dependencias**:
  - `axios`: Para realizar solicitudes HTTP al backend.
  - `react-datepicker`: Selección de fechas para filtrar datos y generar reportes.
  - `jspdf` y `jspdf-autotable`: Generación de reportes en formato PDF.
  - `recharts`: Visualización gráfica de los datos en tiempo real.
  - `tailwindcss`: Estilización del frontend.

**English:**
- **React**: The frontend is developed using React to provide a modern and interactive user interface.
- **Dependencies**:
  - `axios`: To make HTTP requests to the backend.
  - `react-datepicker`: Date selection for filtering data and generating reports.
  - `jspdf` and `jspdf-autotable`: PDF report generation.
  - `recharts`: Graphical visualization of real-time data.
  - `tailwindcss`: Styling for the frontend.

## Requisitos de Hardware / Hardware Requirements

**Español:**
- **Arduino**: Se necesita un dispositivo Arduino para medir datos de temperatura y humedad. Este se conecta al sistema a través de un puerto serie para enviar la información en tiempo real.

**English:**
- **Arduino**: An Arduino device is needed to measure temperature and humidity data. This connects to the system through a serial port to send real-time information.

## Características del Sistema / System Features

**Español:**
- **Visualización en Tiempo Real**: Los datos recibidos del Arduino se muestran en tiempo real mediante gráficos interactivos.
- **Generación de Reportes**: Posibilidad de generar reportes PDF con datos filtrados por rango de fechas, lo que permite analizar períodos específicos.

**English:**
- **Real-Time Visualization**: Data received from Arduino is displayed in real-time using interactive graphs.
- **Report Generation**: Ability to generate PDF reports with data filtered by date range, allowing for specific period analysis.

## Instalación / Installation

1. **Clonar el Repositorio / Clone the Repository**
   ```bash
   git clone <URL del Repositorio>
   cd temp-humidity-monitor
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Configuración del Arduino / Arduino Setup

**Español:**
Conecta el Arduino al sistema mediante un cable USB. Asegúrate de que el script en el Arduino esté configurado para enviar los datos de temperatura y humedad al puerto serie.

**English:**
Connect the Arduino to the system via a USB cable. Ensure the Arduino script is configured to send temperature and humidity data to the serial port.

## Contribuir / Contributing
Las contribuciones son bienvenidas. Por favor, abre un *issue* o envía un *pull request* para sugerencias o mejoras.

**Contributions are welcome. Please open an issue or submit a pull request for suggestions or improvements.**
