const rawUrl = import.meta.env.VITE_API_URL || 'https://cybersecurepk-complaint-backend.onrender.com';
export const API_URL = rawUrl.replace(/\/$/, '');