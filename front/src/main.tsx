// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import DataPage from './pages/DataPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/data" element={<DataPage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
