import axios from 'axios';
import API_BASE_URL from './config'; // Import the API base URL from config

export const loginWithGoogle = async (token) => {
  try {
    // Send token to backend for verification using the imported API_BASE_URL
    const response = await axios.post(`${API_BASE_URL}/auth/google`, { token });
    return response; // Return the response containing user data
  } catch (error) {
    console.error('Error during Google login:', error);
    throw error; // Throw the error to be handled in LoginPage
  }
};
