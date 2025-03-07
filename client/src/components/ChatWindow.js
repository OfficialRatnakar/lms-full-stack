// src/components/ChatWindow.js
import React, { useState, useEffect } from 'react';
import socket from '../socket';

const ChatWindow = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Join the room
    socket.emit('joinRoom', room);

    // Listen for new messages
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [room]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('sendMessage', { room, message: newMessage });
      setNewMessage('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatWindow;