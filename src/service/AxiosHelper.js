
import axios from 'axios';

// Create an Axios instance with default configurations
export const baseURL = 'http://localhost:8080'

export const httpClient = axios.create({
  baseURL:baseURL,
  timeout: 5000, // 5 seconds timeout
  headers: {
    'Content-Type': 'text/plain',
  },
});



