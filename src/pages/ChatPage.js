import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import io from 'socket.io-client';
import axios from 'axios';
import { FiArrowLeft } from 'react-icons/fi';
import API_BASE_URL from '../api/config';
import sendSound from '../assets/sounds/send.mp3';
import receiveSound from '../assets/sounds/receive.mp3';
import { LiaCheckDoubleSolid } from 'react-icons/lia';
import debounce from 'lodash.debounce';

// Initialize socket
const socket = io('https://quickchatbackend-jeal.onrender.com/');

const playSendSound = () => {
  const audio = new Audio(sendSound);
  audio.play();
};

const playReceiveSound = () => {
  const audio = new Audio(receiveSound);
  audio.play();
};

function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const selectedUser = location.state?.selectedUser;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  // Helper function to format message time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', timestamp);
      return ''; // Return empty string for invalid date
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (user && selectedUser) {
      // Join the socket room for real-time updates
      socket.emit('joinRoom', user._id);

      // Fetch message history for this user pair (sender and receiver)
      axios
        .get(`${API_BASE_URL}/messages`, {
          params: {
            senderId: user._id,
            receiverId: selectedUser._id,
          },
        })
        .then((response) => {
          setMessages(response.data); // Set the message history
        })
        .catch((error) => {
          console.error('Error fetching message history:', error);
        });
    }
  }, [user, selectedUser]);

  useEffect(() => {
    if (!user) return; // ⬅️ Important: don't register listeners if user is not ready
  
    socket.on('receiveMessage', (newMessage) => {
      if (newMessage.senderId === user._id) {
        // Ignore your own sent messages
        return;
      }
  
      playReceiveSound();
  
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, { ...newMessage, fromSelf: false }];
        return updatedMessages;
      });
    });
  
    socket.on('messageRead', (messageId) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, seen: true } : msg
        )
      );
    });
  
    return () => {
      socket.off('receiveMessage');
      socket.off('messageRead');
    };
  }, [user]);
  
  

  // Handle sending a message
  const sendMessage = debounce(() => {
    if (message.trim() === '') return;

    const newMessage = {
      messageText: message,
      senderId: user._id,
      receiverId: selectedUser._id,
      timestamp: new Date().toISOString(),
      seen: false,
    };

    // Immediately update the state with the sent message
    setMessages((prevMessages) => [...prevMessages, { ...newMessage, fromSelf: true }]);

    // Play the send sound when a message is sent
    playSendSound();

    socket.emit('sendMessage', {
      senderId: user._id,
      receiverId: selectedUser._id,
      message: newMessage,
    });
    

    // Clear the input field after sending the message
    setMessage('');
  }, 500); // 500ms debounce delay

  // Trigger debounced send message
  const handleSendMessage = () => {
    sendMessage(); // This will call the debounced function
  };

  // Scroll to the most recent message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-x-hidden"> {/* Prevent horizontal scroll */}
      {/* Top Navbar */}
      <div className="flex items-center bg-green-500 p-4 shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="bg-white p-2 rounded-full text-green-500 mr-4"
        >
          <FiArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <img
            src={selectedUser?.avatar}
            alt={selectedUser?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-white">
            <h2 className="font-bold text-lg">{selectedUser?.name}</h2>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isSelf = msg.fromSelf;
          const messageTime = formatTime(msg.timestamp);

          return (
            <div key={index} className={`flex ${isSelf ? 'justify-end' : 'justify-start'} px-2`}>
              <div
                className={`relative max-w-[75%] p-3 rounded-2xl ${isSelf ? 'bg-green-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'} shadow`}
              >
                <div className="flex justify-between items-center">
                  <p className="break-words text-sm flex-1 mr-5">{msg.messageText}</p> {/* Added margin-right to create gap */}

                  {/* Time + Tick (Same Line) */}
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="text-[10px]">{messageTime}</span>

                    {/* Message Status - Double Tick for Sent */}
                    <span>
                      {msg.seen ? (
                        <LiaCheckDoubleSolid className="text-gray-500" />
                      ) : msg.delivered ? (
                        <LiaCheckDoubleSolid className="text-gray-500" />
                      ) : (
                        <LiaCheckDoubleSolid className="text-gray-300" />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 flex gap-4 bg-white shadow-inner">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)} // Immediate input update
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} // Trigger sending on 'Enter'
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Type a message"
        />
        <button
          onClick={handleSendMessage}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
