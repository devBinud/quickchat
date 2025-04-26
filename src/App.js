import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { UserProvider, useUser } from './context/UserContext';
import ChatPage from './pages/ChatPage';

// Separate the Routes logic
function AppRoutes() {
  const { user } = useUser();

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/home" /> : <LoginPage />}
      />
      <Route
        path="/home"
        element={user ? <HomePage /> : <Navigate to="/" />}
      />

      <Route path="/chat/:id" element={<ChatPage />} />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;
