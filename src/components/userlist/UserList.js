// src/components/OtherUsersList.js

import React from 'react';

function OtherUsersList({ otherUsers, handleChatNow }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Other Users</h2>
      {otherUsers.length === 0 ? (
        <p className="text-center text-gray-500">No other users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherUsers.map((u) => (
            <div key={u._id} className="bg-white rounded-2xl shadow p-6 text-center">
              <img 
                src={u.avatar} 
                alt={u.name} 
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold">{u.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{u.email}</p>
              <button 
                onClick={() => handleChatNow(u)}
                className="px-5 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full font-semibold transition duration-300"
              >
                Chat Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OtherUsersList;
