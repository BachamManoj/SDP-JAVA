import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import PatientDashboard from './PatientDashboard';
import './Chat.css';

const Chat = ({ user2 }) => {
    const [patientData, setPatientData] = useState({ email: '' });
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);

    const fetchPatientData = async () => {
        try {
            const res = await axios.get('https://sdp-2200030709-production.up.railway.app/getPatientDetails', { withCredentials: true });
            setPatientData(res.data);

            const response = await axios.get('https://sdp-2200030709-production.up.railway.app/api/chat/history', {
                params: { sender: res.data.email, receiver: user2 },
                withCredentials: true,
            });
            setMessages(response.data);
        } catch (err) {
            console.error("Failed to fetch patient data or chat history:", err);
        }
    };

    useEffect(() => {
        fetchPatientData(); 

        const intervalId = setInterval(fetchPatientData, 10000);

        return () => clearInterval(intervalId);
    }, [user2]);
    useEffect(() => {
        const socket = new SockJS('https://sdp-2200030709-production.up.railway.app/ws');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            client.subscribe(`/user/queue/messages`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                if (
                    (receivedMessage.sender === patientData.email && receivedMessage.receiver === user2) ||
                    (receivedMessage.sender === user2 && receivedMessage.receiver === patientData.email)
                ) {
                    setMessages(prevMessages => [...prevMessages, receivedMessage]);
                }
            });
            setStompClient(client);
        });

        return () => {
            if (client) {
                client.disconnect();
            }
        };
    }, [patientData.email, user2]);

    const sendMessage = () => {
        if (stompClient && inputMessage.trim() && patientData.email) {
            const message = {
                sender: patientData.email,
                receiver: user2,
                content: inputMessage,
                timestamp: new Date().toISOString(),
            };
            stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(message));
            setInputMessage('');
            setMessages(prevMessages => [...prevMessages, message]); // Add to local state immediately
        }
    };

    return (

            
            <div className="chat-main">
                <div className="chat-container">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message-bubble ${msg.sender === patientData.email ? 'sent' : 'received'}`}
                        >
                            <span className="message-content">{msg.content}</span>
                            <span className="message-timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        
    );
};

export default Chat;
