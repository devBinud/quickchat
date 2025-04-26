import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function LoginPage() {
  const navigate = useNavigate();
  const { setUserData, user } = useUser() // Use context instead of local state

  const handleGoogleLogin = async (response) => {
    const { credential } = response;

    try {
      const res = await axios.post('https://quickchatbackend-jeal.onrender.com/api/auth/google', { token: credential });

      // Save user in Context
      setUserData(res.data.user);

      console.log('Login Successful:', res.data);

      // Redirect to HomePage
      navigate('/home');
    } catch (error) {
      console.error('Google Login Error:', error);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google Login Error:', error);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>QuickChat</h1>

      {user ? (
        <div>
          <h2>Welcome, {user.name}</h2>
          <img src={user.avatar} alt="avatar" width="50" height="50" />
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={handleGoogleError}
        />
      )}
    </div>
  );
}

export default LoginPage;
