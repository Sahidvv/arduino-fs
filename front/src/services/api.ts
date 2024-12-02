// src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const fetchData = async (start: number, end: number) => {
  try {
    const response = await axios.get(`${API_URL}/data`, {
      params: { start, end },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching data:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const fetchDailyReport = async () => {
  try {
    const response = await axios.get(`${API_URL}/reports/daily`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching daily report:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};
