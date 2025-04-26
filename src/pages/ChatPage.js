import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('https://quickchatbackend-jeal.onrender.com/');

function ChatPage() {
  const location = useLocation();
  const { user } = useUser();
  const selectedUser = location.state?.selectedUser;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user && selectedUser) {
      axios.get('https://quickchatbackend-jeal.onrender.com/api/messages', {
        params: { userId: user._id, targetUserId: selectedUser._id }
      })
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });

      socket.emit('joinRoom', user._id);
    }
  }, [user, selectedUser]);

  useEffect(() => {
    socket.on('receiveMessage', ({ senderId, message }) => {
      setMessages(prevMessages => [...prevMessages, { ...message, fromSelf: false }]);
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

    axios.post('https://quickchatbackend-jeal.onrender.com/api/messages', newMessage)
      .then((response) => {
        setMessages(prevMessages => [...prevMessages, { ...response.data, fromSelf: true }]);
        
        socket.emit('sendMessage', {
          senderId: user._id,
          receiverId: selectedUser._id,
          message: response.data
        });
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });

    setMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-6">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col flex-1">
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={selectedUser?.avatar} 
            alt={selectedUser?.name} 
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{selectedUser?.name}</h1>
            <p className="text-gray-500 text-sm">{selectedUser?.email}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
{/* Messages */}
<div className="flex-1 overflow-y-auto mb-4 space-y-4 p-2">
{messages.map((msg, index) => {
  const isSelf = msg.fromSelf;
  const hasValidTime = msg.createdAt && !isNaN(new Date(msg.createdAt).getTime());
  const messageTime = hasValidTime ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div 
      key={index}
      className={`flex ${isSelf ? 'justify-end' : 'justify-start'} px-2`}
    >
      <div className={`relative max-w-[75%] p-3 rounded-2xl ${isSelf ? 'bg-green-500 text-white rounded-br-none' : 'bg-gray-300 text-gray-800 rounded-bl-none'}`}>
        <p className="break-words">{msg.messageText}</p>

        {/* Time and ticks */}
        {hasValidTime && (
          <div className={`flex items-center gap-1 text-xs mt-1 ${isSelf ? 'justify-end text-white/80' : 'justify-start text-gray-600'}`}>
            <span className="text-[10px]">{messageTime}</span>
            {isSelf && (
              <span>
                {msg.seen ? '✓✓' : '✓'}
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


          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="flex gap-4">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Type your message..."
          />
          <button 
            onClick={handleSendMessage}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
