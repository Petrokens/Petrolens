import api from '../lib/axios';

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  localStorage.setItem('accessToken', response.data.accessToken);
  return response.data;
};
