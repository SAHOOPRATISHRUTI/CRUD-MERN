import axios from 'axios';

const API_URL = 'http://localhost:4002/api/users';

export const createUser = async (userData) => {
  const response = await axios.post(`${API_URL}/create`, userData);
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const updateUser = async (userId, updatedData) => {
  const response = await axios.put(`${API_URL}/update/${userId}`, updatedData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/delete/${userId}`);
  return response.data;
};
