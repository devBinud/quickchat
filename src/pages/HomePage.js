import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical } from 'react-icons/fi'; // Three dots icon
import API_BASE_URL from '../api/config';
import { FaEdit, FaCog,  FaSignOutAlt } from 'react-icons/fa'; // Importing icons


function HomePage() {
  const { user, clearUserData } = useUser();
  const [otherUsers, setOtherUsers] = useState([]);
  const [emailVisible, setEmailVisible] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const navigate = useNavigate();

  // Define the functions
  const handleEditProfile = () => {
    // Logic to edit profile, e.g., navigate to profile editing page
    console.log('Edit Profile Clicked');
  };


  const handleSettings = () => {
    // Logic to open settings, e.g., navigate to settings page
    console.log('Settings Clicked');
  };

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
        const response = await axios.get(`${API_BASE_URL}/users`, {
          params: {
            email: user.email,
            currentUserId: user._id
          }
        });

        const users = response.data;
        const filteredUsers = users.filter((u) => u.email !== user.email);

        // Fetch the last message for each user pair
        const updatedUsers = await Promise.all(
          filteredUsers.map(async (u) => {
            const lastMessageResponse = await axios.get(`${API_BASE_URL}/messages/lastMessage`, {
              params: {
                senderId: user._id,
                receiverId: u._id
              }
            });

            const lastMessage = lastMessageResponse.data || "No messages yet";
            return {
              ...u,
              lastMessage: lastMessage.messageText || lastMessage // Assign the last message or a default message
            };
          })
        );

        setOtherUsers(updatedUsers);
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
    <div className="bg-white w-64 p-6 h-full shadow-lg flex flex-col space-y-4">
      <button
        onClick={() => setShowDrawer(false)}
        className="text-gray-500 mb-6 self-end text-2xl"
      >
        &times;
      </button>
      
      {/* Avatar and User Info */}
      <div className="text-center mb-8">
        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-[#25D366] transition-transform transform hover:scale-105"
        />
        <h2 className="text-lg font-bold text-gray-700">{user.name}</h2>

        {/* Show email with a link */}
        <p className="text-gray-500 text-sm">
          <button
            onClick={() => setEmailVisible(!emailVisible)}
            className="text-green-500 hover:underline"
          >
            {emailVisible ? user.email : 'Click to view email'}
          </button>
        </p>
      </div>

      {/* Additional Options */}
      <div className="space-y-3">
        <button
          onClick={handleEditProfile}
          className="w-full text-left text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition duration-200"
        >
          <FaEdit className="inline-block mr-2" /> Edit Profile
        </button>
        <button
          onClick={handleSettings}
          className="w-full text-left text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition duration-200"
        >
          <FaCog className="inline-block mr-2" /> Settings
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-auto w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-200"
      >
        <FaSignOutAlt className="inline-block mr-2" /> Logout
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
          <p className="text-center text-gray-500">No users found</p>
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
                  alt=""
                  loading="lazy"
                  className="w-16 h-16 rounded-full border-2 object-cover mr-4 bg-gray-200"
                  onError={(e) => {
                    // Display a temporary fallback for 1 second before showing the default image
                    setTimeout(() => {
                      e.target.src = '/default-avatar.png'; // Default image fallback
                    }, 1000);
                  }}
                />


                {/* Name and Last Message */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{u.name}</h3>
                  <p className="text-gray-500 text-sm">{u.lastMessage}</p>
                </div>

                {/* Message Count */}
                <div className="ml-4">
                  <div className="bg-green-500 text-white text-xs font-bold w-3 h-3 rounded-full flex items-center justify-center">
                    {/* <p>Dynamic unread message</p> */}
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
