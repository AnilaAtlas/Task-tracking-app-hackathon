// /client/src/config.js

// For Vite: use import.meta.env
// For Create-React-App: use process.env.REACT_APP_BACKEND_URL

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ||  (import.meta.env.DEV ? 'http://localhost:3001/api':'/api');
