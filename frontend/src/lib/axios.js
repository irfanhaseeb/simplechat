import axios from 'axios'

// Create a axios instance to be used throughout application
export const axiosInstance = axios.create({
  baseUrl: 'http://localhost:5001/api',
  // Send cookies with every request
  withCredentials: true,
})
