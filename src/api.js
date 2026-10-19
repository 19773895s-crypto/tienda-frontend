import axios from 'axios';

// En Vercel toma la URL de Render (variable VITE_API_URL).
// En tu computadora, si la variable no existe, usa el backend local.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL
});
