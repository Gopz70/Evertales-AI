import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// if the token is invalid/expired, clear it and bounce to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  changePassword: (data) => api.put('/change-password', data),
};

export const storyAPI = {
  getAll: () => api.get('/stories'),
  getById: (id) => api.get(`/stories/${id}`),
  create: (data) => api.post('/stories', data),
  update: (id, data) => api.put(`/stories/${id}`, data),
  delete: (id) => api.delete(`/stories/${id}`),
  search: (q) => api.get(`/stories/search?q=${encodeURIComponent(q)}`),
  uploadMedia: (storyId, formData) =>
    api.post(`/stories/${storyId}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteMedia: (mediaId) => api.delete(`/stories/media/${mediaId}`),
  getPublic: () => api.get('/stories/public'),
  getPublicById: (id) => api.get(`/stories/public/${id}`),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
};

export const aiAPI = {
  generateTags: (text) => api.post('/generate-tags', { text }),
};

export default api;
