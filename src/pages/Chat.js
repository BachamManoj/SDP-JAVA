import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import Navbar from './Navbar';

const Chat = () => {
    const [patientData, setPatientData] = useState({ email: '' });
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        // Fetch patient details first
        const fetchPatientData = async () => {
            try {
                const res = await axios.get('https://sdp-2200030709-production.up.railway.app/getPatientDetails', { withCredentials: true });
                setPatientData(res.data);
                
                fetch(`/chat/history?sender=${res.data.email}&receiver=User2`)
                    .then(response => response.json())
                    .then(data => setMessages(data));

                
                const socket = new SockJS('https://sdp-2200030709-production.up.railway.app/ws');
                const client = Stomp.over(socket);
                
                client.connect({}, () => {
                    client.subscribe('/topic/messages', (message) => {
                        setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
                    });
                });

                setStompClient(client);
            } catch (err) {
                console.error("Failed to fetch patient data:", err);
            }
        };

        fetchPatientData();

        return () => {
            if (stompClient) stompClient.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (stompClient && inputMessage && patientData.email) {
            const message = {
                sender: patientData.email, // Dynamic sender identification
                receiver: 'User2', // Specify receiver dynamically
                content: inputMessage,
            };
            stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(message));
            setInputMessage('');
        }
    };

    return (
        
        <div>
            <Navbar/>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}:</strong> {msg.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
