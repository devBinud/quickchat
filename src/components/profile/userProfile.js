// src/components/UserProfile.js

import React from 'react';

function UserProfile({ user, handleLogout }) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center mb-10">
      <img 
        src={user.avatar} 
        alt="User Avatar" 
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
      <p className="text-gray-600 mb-4">{user.email}</p>
      <button 
        onClick={handleLogout} 
        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition duration-300"
      >
        Logout
      </button>
    </div>
  );
}

export default UserProfile;
