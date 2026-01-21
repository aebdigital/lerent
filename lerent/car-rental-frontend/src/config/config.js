// Configuration for the application
const config = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'https://carflow-reservation-system.onrender.com',
  ADMIN_EMAIL: import.meta.env.VITE_ADMIN_EMAIL || 'lerent@lerent.sk',
  SITE_URL: import.meta.env.VITE_SITE_URL || 'http://localhost:3006'
};

export default config;
