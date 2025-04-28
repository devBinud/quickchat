import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import io from 'socket.io-client';
import axios from 'axios';
import { FiArrowLeft } from 'react-icons/fi'; // back arrow icon

// Import sounds
import sendSoundFile from '../assets/sounds/send.mp3';
import receiveSoundFile from '../assets/sounds/receive.mp3';
import notificationSoundFile from '../assets/sounds/notification.mp3';
import API_BASE_URL from '../api/config';

// Initialize socket
const socket = io('http://localhost:5000/');

function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const selectedUser = location.state?.selectedUser;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Create Audio instances
  const sendSound = useRef(new Audio(sendSoundFile));
  const receiveSound = useRef(new Audio(receiveSoundFile));
  const notificationSound = useRef(new Audio(notificationSoundFile));

  // Optional: Set volume
  useEffect(() => {
    sendSound.current.volume = 0.5;
    receiveSound.current.volume = 0.5;
    notificationSound.current.volume = 0.5;
  }, []);

  useEffect(() => {
    if (user && selectedUser) {
      axios.get(`${API_BASE_URL}/messages`, {
        params: { userId: user._id, targetUserId: selectedUser._id }
      })
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });

      socket.emit('joinRoom', user._id); // Ensure user joins the correct socket room
    }
  }, [user, selectedUser]);

  // Listen for incoming messages via socket
  useEffect(() => {
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, { ...newMessage, fromSelf: false }]);
      
      if (document.visibilityState === 'visible') {
        receiveSound.current.play(); // Play receive sound if user is active
      } else {
        notificationSound.current.play(); // Play notification sound if user is inactive
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    const newMessage = {
      messageText: message,
      senderId: user._id,
      receiverId: selectedUser._id,
    };

    // Save the message to the database
    axios.post('http://localhost:5000/api/messages', newMessage)
      .then((response) => {
        setMessages((prevMessages) => [...prevMessages, { ...response.data, fromSelf: true }]);
        
        // Emit the message via socket to the receiver
        socket.emit('sendMessage', {
          senderId: user._id,
          receiverId: selectedUser._id,
          message: response.data
        });

        sendSound.current.play(); // Play send sound after successful send
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });

    setMessage('');
  };

  const markAsRead = (messageId) => {
    axios.put(`${API_BASE_URL}/messages/${messageId}/read`)
      .then((response) => {
        setMessages((prevMessages) => 
          prevMessages.map(msg => 
            msg._id === messageId ? { ...msg, seen: true } : msg
          )
        );
      })
      .catch((error) => {
        console.error('Error marking message as read:', error);
      });
  };

  useEffect(() => {
    if (user && selectedUser) {
      messages.forEach((msg) => {
        if (!msg.fromSelf && !msg.seen) {
          markAsRead(msg._id);
        }
      });
    }
  }, [messages, user, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
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
          const hasValidTime = msg.createdAt && !isNaN(new Date(msg.createdAt).getTime());
          const messageTime = hasValidTime ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

          return (
            <div 
              key={index}
              className={`flex ${isSelf ? 'justify-end' : 'justify-start'} px-2`}
            >
              <div className={`relative max-w-[75%] p-3 rounded-2xl ${isSelf ? 'bg-green-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'} shadow`}>
                <p className="break-words">{msg.messageText}</p>

                {/* Time + Ticks */}
                {hasValidTime && (
                  <div className={`flex items-center gap-1 text-xs mt-1 ${isSelf ? 'justify-end text-white/70' : 'justify-start text-gray-500'}`}>
                    <span className="text-[10px]">{messageTime}</span>
                    {isSelf && (
                      <span>
                        {msg.seen ? (
                          <span className="text-blue-600">✓✓</span> // Blue double tick for read
                        ) : (
                          '✓' // Single tick for sent
                        )}
                      </span>
                    )}
                  </div>
                )}
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
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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
