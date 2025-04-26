import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate for redirection

function HomePage() {
  const { user, clearUserData } = useUser();
  const [otherUsers, setOtherUsers] = useState([]);
  const navigate = useNavigate(); // For navigating to chat page

  const handleLogout = () => {
    clearUserData();
    window.location.href = '/';
  };

  const handleChatNow = (selectedUser) => {
    // You can pass user ID or whole object as needed
    navigate(`/chat/${selectedUser._id}`, { state: { selectedUser } });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://quickchatbackend-jeal.onrender.com/api/users');
        const users = response.data;
        const filteredUsers = users.filter(u => u.email !== user.email);
        setOtherUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (user) fetchUsers();
  }, [user]);

  if (!user) return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* User Profile */}
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

      {/* Other Users */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Other Users</h2>
        {otherUsers.length === 0 ? (
          <p className="text-center text-gray-500">No other users found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition duration-300"
                >
                  Chat Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;