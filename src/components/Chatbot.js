import React, { useState } from 'react';
import axios from 'axios';
import "./Chatbot.css";
import { FaRobot } from 'react-icons/fa';

const Chatbot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [email,setEmail] = useState('');
  const [isTyping, setIsTyping] = useState(false); // ✅ Typing Indicator


  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);  // Toggle modal visibility
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() !== '') {
      setMessages([...messages, { text: userInput, sender: 'user' }]);
      setUserInput('');
      setIsTyping(true); // ✅ Show typing indicator
  
      try {
        const response = await axios.post('http://127.0.0.1:5000/get-advice', {
          question: userInput
        });
  
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            { text: response.data.answer, sender: 'bot' }
          ]);
          setIsTyping(false);
        }, 1500); // Simulate typing delay
      } catch (error) {
        console.error('Error getting response from server:', error);
        setMessages(prev => [
          ...prev,
          { text: 'Sorry, I could not get an answer. Please try again later.', sender: 'bot' }
        ]);
        setIsTyping(false);
      }
    }
  };
  
  const sendAdvice = async () => {
    if (email.trim() !== '') {
      // Add user's message to chat
      setMessages([...messages, { text: email, sender: 'user' }]);

      try {
        // Call your Flask backend API
        const response = await axios.post('http://127.0.0.1:5000/get-budget-advice', {
          email: email
        });

        // Add bot's response to chat
        setMessages([
          ...messages,
          { text: email, sender: 'user' },
          { text: response.data.advice || "No advice available", sender: 'bot' }, // ✅ Ensure advice is shown
        ]);
      } catch (error) {
        console.error('Error getting response from server:', error);
        setMessages([
          ...messages,
          { text: 'Sorry, I could not get an answer. Please try again later.', sender: 'bot' }
        ]);
      }

      setEmail('');
    }
  };

  return (
    <>
      {/* Chatbot Button */}
      <div className="history-con">
      <button className="chatbot-icon" onClick={toggleChatbot}>
       <FaRobot className="chat-icon" />
          </button>
      </div>

      {/* Chatbot Modal */}
      {isChatbotOpen && (
        <div className="chatbot-modal">
          <div className="chatbot-container">
            <div className="chatbot-header">
              <h3>Chatbot</h3>
              <button className="close-btn" onClick={toggleChatbot}>X</button>
            </div>
            <div className="chatbot-messages">
              {messages.map((message, index) => (
                <div key={index} className={message.sender}>
                  {message.sender === 'bot' && <FaRobot className="bot-avatar" />} {/* ✅ Avatar */}
                  <p>{message.text}</p>
                </div>
              ))}
              {isTyping && <p className="typing-indicator">Chatbot is typing...</p>} {/* ✅ Typing Indicator */}
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Ask me a question..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
            <div>
              <input
              type='text'
              value={email}
              onChange={handleEmailChange}
              placeholder='enter ur email'
              />
              <button onClick={sendAdvice}>Done</button>
            </div>
          </div>
          <div className="quick-replies">
  <button onClick={() => setUserInput("How can I save money?")}>💰 Save Money</button>
  <button onClick={() => setUserInput("How do I budget my expenses?")}>📊 Budget Tips</button>
  <button onClick={() => setUserInput("How to invest wisely?")}>📈 Investing</button>
</div>
          <div className="chatbot-overlay" onClick={toggleChatbot}></div>  {/* Close on click outside */}
        </div>
      )}
    </>
  );
};

export default Chatbot;