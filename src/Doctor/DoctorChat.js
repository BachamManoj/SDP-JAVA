import React, { useState, useEffect } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./DoctorChat.css";
import api from "../api/apiClient";

const DoctorChat = ({ receiver }) => {
  const [doctor, setDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);

  const WS_URL = `${process.env.REACT_APP_API_URL}/ws`;

  /** Fetch Logged-in Doctor + Previous Messages */
  const loadInitialData = async () => {
    try {
      const doctorRes = await api.get("/getDoctorDetails");
      const doctorData = doctorRes.data;
      setDoctor(doctorData);

      const historyRes = await api.get("/api/chat/history", {
        params: { sender: doctorData.email, receiver },
      });

      setMessages(historyRes.data);
    } catch (err) {
      console.error("Error loading doctor chat data:", err);
    }
  };

  /** Load Doctor + History when receiver changes */
  useEffect(() => {
    loadInitialData();
  }, [receiver]);

  /** WebSocket Setup */
  useEffect(() => {
    if (!doctor?.email) return;

    const socket = new SockJS(WS_URL);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe("/user/queue/messages", (message) => {
        const received = JSON.parse(message.body);
        setMessages((prev) => [...prev, received]);
      });

      client.subscribe("/user/queue/history", (message) => {
        setMessages(JSON.parse(message.body));
      });

      setStompClient(client);
    });

    return () => {
      if (client) client.disconnect();
    };
  }, [doctor]);

  /** Send Message */
  const sendMessage = () => {
    if (!stompClient || !inputMessage.trim() || !doctor?.email) return;

    const message = {
      sender: doctor.email,
      receiver,
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(message));
    setMessages((prev) => [...prev, message]);
    setInputMessage("");
  };

  return (
    <div className="chat-main">
      <div className="chat-container">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message-bubble ${
              msg.sender === doctor?.email ? "sent" : "received"
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

export default DoctorChat;
