import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import api from "../api/apiClient";
import "./Chat.css";

const Chat = ({ user2 }) => {
    const [patientData, setPatientData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [stompClient, setStompClient] = useState(null);

    // Extract backend URL from axios instance
    const BASE_URL = api.defaults.baseURL; // ❤️ No hardcoding

    // ------------------------------------------------------------------
    // Load logged-in patient + chat history
    // ------------------------------------------------------------------
    const loadChatData = async () => {
        try {
            const patientRes = await api.get("/getPatientDetails");
            const patient = patientRes.data;
            setPatientData(patient);

            const historyRes = await api.get("/api/chat/history", {
                params: { sender: patient.email, receiver: user2 },
            });

            setMessages(historyRes.data);
        } catch (err) {
            console.error("Chat load error:", err);
        }
    };

    useEffect(() => {
        loadChatData();
    }, [user2]);

    // ------------------------------------------------------------------
    // WebSocket connection
    // ------------------------------------------------------------------
    useEffect(() => {
        if (!patientData?.email) return;

        const socket = new SockJS(`${BASE_URL}/ws`);  // ❤️ using api baseURL
        const client = Stomp.over(socket);

        client.connect({}, () => {
            console.log("Connected to WebSocket");

            client.subscribe("/user/queue/messages", (msg) => {
                const received = JSON.parse(msg.body);

                const relevant =
                    (received.sender === patientData.email && received.receiver === user2) ||
                    (received.sender === user2 && received.receiver === patientData.email);

                if (relevant) {
                    setMessages((prev) => [...prev, received]);
                }
            });
        });

        setStompClient(client);

        return () => {
            if (client && client.connected) {
                client.disconnect(() => console.log("WebSocket disconnected"));
            }
        };
    }, [patientData, user2, BASE_URL]);

    // ------------------------------------------------------------------
    // Send message
    // ------------------------------------------------------------------
    const sendMessage = () => {
        if (!inputMessage.trim() || !stompClient || !patientData) return;

        const msg = {
            sender: patientData.email,
            receiver: user2,
            content: inputMessage,
            timestamp: new Date().toISOString(),
        };

        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(msg));

        setMessages((prev) => [...prev, msg]);
        setInputMessage("");
    };

    return (
        <div className="chat-main">
            <div className="chat-container">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`message-bubble ${
                            msg.sender === patientData?.email ? "sent" : "received"
                        }`}
                    >
                        <span className="message-content">{msg.content}</span>
                        <span className="message-timestamp">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
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
