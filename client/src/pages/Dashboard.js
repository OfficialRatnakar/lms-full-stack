// src/pages/Dashboard.js
import React, { useState } from 'react';
import ChatWindow from '../components/ChatWindow';

const Dashboard = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <button onClick={() => setSelectedRoom('room1')}>Join Room 1</button>
        <button onClick={() => setSelectedRoom('room2')}>Join Room 2</button>
      </div>
      {selectedRoom && <ChatWindow room={selectedRoom} />}
    </div>
  );
};

export default Dashboard;