import api from './api';

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem('vopa_token', token);
        localStorage.setItem('vopa_user', JSON.stringify(user));
        return { user, token };
      }
      throw new Error(response.data?.message || 'Login failed');
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw err;
    }
  },

  register: async (name, email, password, role) => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      if (response.data && response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem('vopa_token', token);
        localStorage.setItem('vopa_user', JSON.stringify(user));
        return { user, token };
      }
      throw new Error(response.data?.message || 'Registration failed');
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignored: stateless JWT client clear
    } finally {
      localStorage.removeItem('vopa_token');
      localStorage.removeItem('vopa_user');
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('vopa_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};

export default authService;
