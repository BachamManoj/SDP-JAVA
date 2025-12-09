import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import api from '../api/apiClient';
import Navbar from './Navbar';

const Chat = () => {
  const [patientData, setPatientData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const res = await api.get('/getPatientDetails');
        setPatientData(res.data);

        const history = await api.get('/api/chat/history', {
          params: {
            sender: res.data.email,
            receiver: 'admin'
          }
        });
        setMessages(history.data);

        const socket = new SockJS(`${process.env.REACT_APP_BASE_URL}/ws`);
        const client = Stomp.over(socket);

        client.connect({}, () => {
          client.subscribe('/user/queue/messages', (msg) => {
            const newMessage = JSON.parse(msg.body);
            setMessages((prev) => [...prev, newMessage]);
          });
        });

        setStompClient(client);
      } catch (err) {
        console.error("Chat initialization failed:", err);
      }
    };

    initChat();

    return () => {
      if (stompClient) stompClient.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!stompClient || !inputMessage || !patientData) return;

    const msg = {
      sender: patientData.email,
      receiver: 'admin',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(msg));
    setMessages((prev) => [...prev, msg]);
    setInputMessage('');
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h3 className="text-center mb-3">Chat with Admin</h3>

        <div
          className="p-3 border rounded mb-3"
          style={{ height: '60vh', overflowY: 'auto', background: '#f8f9fa' }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 my-2 rounded ${
                msg.sender === patientData?.email
                  ? 'bg-primary text-white ms-auto'
                  : 'bg-light text-dark me-auto'
              }`}
              style={{ width: 'fit-content', maxWidth: '70%' }}
            >
              <strong>{msg.sender}:</strong> {msg.content}
            </div>
          ))}
        </div>

        <div className="d-flex">
          <input
            type="text"
            className="form-control"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button className="btn btn-success ms-2" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
