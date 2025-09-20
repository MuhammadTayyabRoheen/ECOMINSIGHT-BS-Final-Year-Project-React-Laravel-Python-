import React, { useState } from 'react';
import '../../style/Chatbot.css';
import botIcon from '../../assets/icons/bot.gif'; // Add a cute animated GIF here

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot-container">
      <div className={`chatbot-popup ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <span>🤖 Customer Assistant</span>
          <button onClick={toggleChat}>✖</button>
        </div>
        <div className="chatbot-body">
          <p className="greeting">Hi there! 👋 How can I help you?</p>
          <ChatbotForm />
        </div>
      </div>

      <div className="chatbot-icon" onClick={toggleChat}>
        <img src={botIcon} alt="Chatbot" />
        {!isOpen && <span className="tooltip">How can I help you?</span>}
      </div>
    </div>
  );
};

export default ChatbotWidget;

const ChatbotForm = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setResponse(data.reply || 'Something went wrong.');
    } catch (error) {
      setResponse('Error connecting to chatbot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-form">
      <textarea
        rows={2}
        placeholder="Ask anything..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? '...' : 'Send'}
      </button>
      {response && <div className="chatbot-reply">{response}</div>}
    </div>
  );
};
