import React from 'react';
import ReactDOM from 'react-dom/client';  // Updated import for React 18
import { GoogleOAuthProvider } from '@react-oauth/google';  // Import GoogleOAuthProvider
import App from './App';

// Your Google Client ID from Google Developer Console
const clientId = '155005810407-l9djv7het5t9jjhslbidgflv68esu7t8.apps.googleusercontent.com';

const root = ReactDOM.createRoot(document.getElementById('root'));  // Use createRoot instead of render
root.render(
  <GoogleOAuthProvider clientId={clientId}>  {/* Wrap your app with GoogleOAuthProvider */}
    <App />
  </GoogleOAuthProvider>
);
