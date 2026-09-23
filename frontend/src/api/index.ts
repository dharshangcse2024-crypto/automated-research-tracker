import axios from 'axios';
import type { Topic, Article } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // Required to bypass ngrok's anti-abuse interstitial screen
    'ngrok-skip-browser-warning': 'true'
  }
});

export const apiClient = {
  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
  getTopics: async (): Promise<Topic[]> => {
    const response = await api.get<Topic[]>('/api/topics');
    return response.data;
  },
  getArticles: async (): Promise<Article[]> => {
    const response = await api.get<Article[]>('/api/articles');
    return response.data;
  }
};
