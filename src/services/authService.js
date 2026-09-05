// import api from './api';

// This is a mock implementation for now as requested.
// Once backend is ready, uncomment the api imports and replace logic.
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const authService = {
  login: async (email, password) => {
    await delay(800); // Simulate network request
    
    // Mock user
    if (email && password) {
      const user = {
        id: '1',
        name: 'Aarav Sharma',
        email,
        role: 'STUDENT',
        avatar: 'https://i.pravatar.cc/150?u=aarav'
      };
      localStorage.setItem('vopa_token', 'mock_token_123');
      localStorage.setItem('vopa_user', JSON.stringify(user));
      return { user, token: 'mock_token_123' };
    }
    throw new Error('Invalid credentials');
  },

  register: async (name, email, password, role) => {
    await delay(800);
    const user = {
      id: '2',
      name,
      email,
      role: role || 'STUDENT',
      avatar: 'https://i.pravatar.cc/150?u=' + email
    };
    localStorage.setItem('vopa_token', 'mock_token_456');
    localStorage.setItem('vopa_user', JSON.stringify(user));
    return { user, token: 'mock_token_456' };
  },

  logout: () => {
    localStorage.removeItem('vopa_token');
    localStorage.removeItem('vopa_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('vopa_user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }
};

export default authService;
