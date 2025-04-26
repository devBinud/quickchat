import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';  // 🚀 Import service worker functions

const clientId = '155005810407-l9djv7het5t9jjhslbidgflv68esu7t8.apps.googleusercontent.com';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);

// 🚀 Register the service worker
serviceWorkerRegistration.register();
