import "./LoginPage.css";
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import API_BASE_URL from '../api/config';
import InstallPWA from "../components/InstallPWA.js"

function LoginPage() {
  const navigate = useNavigate();
  const { setUserData, user } = useUser();

  const handleGoogleLogin = async (response) => {
    const { credential } = response;
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/google`, { token: credential });
      setUserData(res.data.user);
      console.log('Login Successful:', res.data);
      navigate('/home');
    } catch (error) {
      console.error('Google Login Error:', error);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google Login Error:', error);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">

      {/* Top Half - Green */}
      <div className="flex-1 bg-green-500" />

      {/* Bottom Half - White */}
      <div className="flex-1 bg-white" />

      {/* Login Box - Positioned in Center */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="relative p-1 rounded-xl bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 animate-gradient-border">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 flex flex-col items-center justify-center shadow-xl min-w-[300px]">
            
            {/* App Name */}
            <h1 className="text-4xl font-bold text-green-500 mb-6">QuickChat</h1>

            {user ? (
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">Welcome, {user.name}</h2>
                <img src={user.avatar} alt="avatar" className="w-16 h-16 rounded-full mx-auto" />
              </div>
            ) : (
              <>
                <h2 className="font-semibold mb-6 text-gray-700">Sign in to continue</h2>
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={handleGoogleError}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <InstallPWA/>

    {/* Footer */}
<footer className="w-full py-2 px-6 bg-gray-100 text-gray-600 flex flex-col sm:flex-row justify-between items-center text-sm mt-4">
  <div className="mb-2 sm:mb-0">
    © {new Date().getFullYear()} QuickChat. All rights reserved.
  </div>
  <div className="space-x-4 hidden lg:flex flex-row items-center">
  <a href="/privacy" className="hover:underline">Privacy Policy</a>
  <a href="/terms" className="hover:underline">Terms of Service</a>
</div>


</footer>


    </div>
  );
}

export default LoginPage;
