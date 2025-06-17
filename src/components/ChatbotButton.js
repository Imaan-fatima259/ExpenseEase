// src/components/ChatbotButton.js
import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import chatimage from "../assests/img/chatimage.png";

const ChatbotButton = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you?" },
  ]);
  const [advice, setAdvice] = useState([
    { sender: "bot", text: "Enter your email to get personalized advice." },
  ]);
  const [email, setEmail] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState(null);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const sendAdvice = async () => {
    if (email.trim() !== "") {
      setAdvice((prev) => [...prev, { sender: "user", text: email }]);
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/get-budget-advice",
          { email }
        );
        setAdvice((prev) => [
          ...prev,
          {
            sender: "bot",
            text: response.data.advice || "No advice available",
          },
        ]);
      } catch (error) {
        console.error("Error getting response from server:", error);
        setAdvice((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Sorry, I could not get an answer. Please try again later.",
          },
        ]);
      }
      setEmail("");
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() !== "") {
      setMessages([...messages, { text: userInput, sender: "user" }]);
      setUserInput("");
      setIsTyping(true);
      try {
        const response = await axios.post("http://127.0.0.1:5000/get-advice", {
          question: userInput,
        });
        setTimeout(() => {
          const botMessages = [
            {
              text: response.data.answer || "Sorry, I could not get an answer.",
              sender: "bot",
            },
          ];

          // If sentiment exists, add it to the message
          if (response.data.sentiment) {
            botMessages.push({
              text: `Sentiment: ${response.data.sentiment}`,
              sender: "bot",
              type: "sentiment",
            });
          }

          setMessages((prev) => [...prev, ...botMessages]);
          setIsTyping(false);
        }, 500);
      } catch (error) {
        console.error("Error getting response from server:", error);
        setMessages((prev) => [
          ...prev,
          {
            text: "Sorry, I could not get an answer. Please try again later.",
            sender: "bot",
          },
        ]);
        setIsTyping(false);
      }
    }
  };

  return (
    <>
      <Button onClick={toggleChatbot}>💬 Chat with us</Button>
      {isChatbotOpen && (
        <div className="chatbot-modal">
          <div className="chatbot-container">
            <div className="chatbot-header">
              <h3>Chatbot</h3>
              <button className="close-btn" onClick={toggleChatbot}>
                X
              </button>
              <div className="chatbot-banner">
                <img
                  src={chatimage}
                  alt="Chatbot Icon"
                />
              </div>
            </div>
            <div className="mode-selection">
              <button onClick={() => setMode("chat")}>
                💬 Chat with Chatbot
              </button>
              <button onClick={() => setMode("advice")}>
                📊 Get Financial Advice
              </button>
            </div>
            {mode === "chat" && (
              <>
                <div className="chatbot-messages">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`${message.sender} ${
                        message.type === "sentiment" ? "sentiment-msg" : ""
                      }`}
                    >
                      <p>{message.text}</p>
                    </div>
                  ))}

                  {isTyping && <p className="typing-indicator">🤖 Typing...</p>}
                  {/* {isTyping && <p>🤖 Typing...</p>} */}
                </div>
                <div className="quick-replies">
                  <button onClick={() => setUserInput("How can I save money?")}>
                    💰 Save Money
                  </button>
                  <button
                    onClick={() => setUserInput("How do I budget my expenses?")}
                  >
                    📊 Budget Tips
                  </button>
                  <button onClick={() => setUserInput("How to invest wisely?")}>
                    📈 Investing
                  </button>
                </div>
                <div className="chatbot-input fixed-bottom">
                  <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Ask me a question..."
                  />
                  <button onClick={sendMessage}>Send</button>
                </div>
              </>
            )}
            {mode === "advice" && (
              <div className="advice-section">
                <div className="advice-display">
                  {advice.map((message, index) => (
                    <div key={index} className={message.sender}>
                      <p>{message.text}</p>
                    </div>
                  ))}
                </div>
                <div className="chatbot-input fixed-bottom">
                  <input
                    type="text"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email..."
                  />
                  <button onClick={sendAdvice}>Send</button>
                </div>
              </div>
            )}
          </div>
          <div className="chatbot-overlay" onClick={toggleChatbot}></div>
        </div>
      )}
    </>
  );
};

const Button = styled.button`
  position: fixed;
  bottom: 40px;
  right: 40px;
  background-color:rgb(190, 101, 248);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
  z-index: 1000;
  &:hover {
    background-color:rgb(236, 186, 243);
    color: black;
  }
`;

export default ChatbotButton;