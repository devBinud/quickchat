import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the UserContext
const UserContext = createContext(null);

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to set user and save to localStorage
  const setUserData = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Function to clear user on logout
  const clearUserData = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, setUserData, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useUser = () => useContext(UserContext);
