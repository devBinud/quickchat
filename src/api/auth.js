import axios from 'axios';

export const loginWithGoogle = async (token) => {
  try {
    // Send token to backend for verification
    const response = await axios.post('https://quickchatbackend-jeal.onrender.com/api/auth/google', { token });
    return response; // Return the response containing user data
  } catch (error) {
    console.error('Error during Google login:', error);
    throw error; // Throw the error to be handled in LoginPage
  }
};
