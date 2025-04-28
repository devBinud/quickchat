import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical } from 'react-icons/fi'; // Three dots icon

function HomePage() {
  const { user, clearUserData } = useUser();
  const [otherUsers, setOtherUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUserData();
    window.location.href = '/';
  };

  const handleChatNow = (selectedUser) => {
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
      } finally {
        setLoadingUsers(false);
      }
    };

    if (user) fetchUsers();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-[#25D366] border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      
      {/* Navbar */}
      <nav className="bg-green-500 p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Quickchat</h1>

          <div className="flex items-center gap-3">
          <img 
  src={user.avatar}
  alt="User Avatar"
  loading="lazy"    // <-- add this
  className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
  onClick={() => setShowDrawer(true)}
/>

            <FiMoreVertical 
              className="text-white text-2xl cursor-pointer"
              onClick={() => setShowDrawer(true)}
            />
          </div>
        </div>
      </nav>

      {/* Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50 transition-all">
          <div className="bg-white w-64 p-6 h-full shadow-lg flex flex-col">
            <button 
              onClick={() => setShowDrawer(false)} 
              className="text-gray-500 mb-6 self-end text-2xl"
            >
              &times;
            </button>
            <div className="text-center mb-8">
              <img 
                src={user.avatar}
                alt="User Avatar"
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-[#25D366]"
              />
              <h2 className="text-lg font-bold">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="mt-auto px-4 py-2 bg-green-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Other Users */}
      <div className="max-w-6xl mx-auto mt-10 p-4">
        {loadingUsers ? (
          // Proper Skeleton Loader
          <div className="grid grid-cols-1 gap-4">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow p-4 flex items-center animate-pulse"
              >
                {/* Avatar Skeleton */}
                <div className="w-16 h-16 rounded-full bg-gray-300 mr-4"></div>

                {/* Name and Last Message Skeleton */}
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>

                {/* Message Count Skeleton */}
                <div className="ml-4">
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : otherUsers.length === 0 ? (
          <p className="text-center text-gray-500">No other users found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {otherUsers.map((u) => (
              <div 
                key={u._id}
                onClick={() => handleChatNow(u)}
                className="bg-white rounded-xl shadow p-4 flex items-center cursor-pointer hover:bg-gray-100 transition"
              >
                {/* Avatar */}
                <img 
  src={u.avatar} 
  alt={u.name}
  loading="lazy"
  className="w-16 h-16 rounded-full border-2 object-cover mr-4 bg-gray-200"
  onError={(e) => { e.target.src = '/default-avatar.png'; }}
/>


                {/* Name and Last Message */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{u.name}</h3>
                  <p className="text-gray-500 italic text-sm">Last message preview...</p>
                </div>

                {/* Message Count */}
                <div className="ml-4">
                  <div className="bg-green-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    3
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
