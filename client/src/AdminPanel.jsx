// src/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:4000');

const AdminPanel = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('receiveMessage', (message) => {
      setChat((prevChat) => [...prevChat, message]);
    });

    axios.get('http://localhost:4000/chats')
      .then((response) => {
        setChat(response.data);
      });

    return () => {
      socket.off('connect');
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', { message, isAdmin: true });
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <div>
        {chat.map((msg) => (
          <div key={msg.id} style={{ color: msg.isAdmin ? 'blue' : 'black' }}>
            <span>{msg.id}: </span>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default AdminPanel;
