import React, { useState, useRef, useEffect } from 'react';

// Helper component for SVG icons
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);

const UserIcon = () => <Icon path="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />;
const BotIcon = () => <Icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-4-4 1.41-1.41L10 12.17l6.59-6.59L18 7l-8 8z" />;
const SendIcon = () => <Icon path="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" className="w-6 h-6 transform rotate-0" />;
const DownloadIcon = () => <Icon path="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />;


// Main Chatbot Component
export default function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm a friendly chatbot. Ask me anything!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Function to scroll to the latest message
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Function to handle the API call
  const fetchBotResponse = async (question) => {
    setIsLoading(true);
    
    // --- IMPORTANT ---
    // Replace this URL with your actual backend endpoint
    const API_URL = 'http://localhost:8000/chatbot/query/'; 
    
    try {
      // Simulate API delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));

      // This is a mock response. In a real application, you would use fetch:
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botAnswer = data.answer || "Sorry, I couldn't find an answer.";
      

      // Mock response logic
      // const mockResponses = {
      //   "hello": "Hi there! How can I help you today?",
      //   "how are you?": "I'm just a bunch of code, but I'm doing great! Thanks for asking.",
      //   "what is react?": "React is a popular JavaScript library for building user interfaces, especially for single-page applications.",
      //   "help": "You can ask me questions about various topics, and I'll do my best to answer!"
      // };
      // const botAnswer = mockResponses[question.toLowerCase().trim().replace('?', '')] || "Sorry, I don't understand that question. Please try asking something else.";


      setMessages(prev => [...prev, { id: Date.now(), text: botAnswer, sender: 'bot' }]);

    } catch (error) {
      console.error("Failed to fetch bot response:", error);
      setMessages(prev => [...prev, { id: Date.now(), text: "Oops! Something went wrong. Please try again later.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;

    // Add user message to the chat
    setMessages(prev => [...prev, { id: Date.now(), text: userMessage, sender: 'user' }]);
    setInput('');

    // Fetch the bot's response
    fetchBotResponse(userMessage);
  };
  
  // Function to download chat history as JSON
  const downloadChatHistory = () => {
    const chatHistory = messages.map(({ id, ...rest }) => rest); // Exclude temporary id
    const jsonString = JSON.stringify(chatHistory, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-history.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="font-sans bg-gray-900 text-white flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-cyan-400">AI Chatbot</h1>
        <button 
          onClick={downloadChatHistory}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          title="Download chat history"
        >
          <DownloadIcon />
          <span className="hidden sm:inline">Download JSON</span>
        </button>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.sender === 'bot' && (
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <BotIcon />
              </div>
            )}
            <div className={`max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl shadow-md ${message.sender === 'user' ? 'bg-cyan-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
              <p className="text-sm">{message.text}</p>
            </div>
             {message.sender === 'user' && (
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                <UserIcon />
              </div>
            )}
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
              <BotIcon />
            </div>
            <div className="max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl shadow-md bg-gray-700 rounded-bl-none flex items-center space-x-2">
                <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></span>
                <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* Input Form */}
      <footer className="bg-gray-800 p-4">
        <form onSubmit={handleSubmit} className="flex items-center max-w-4xl mx-auto bg-gray-700 rounded-lg p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none px-3"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-cyan-500 text-white rounded-md p-2 hover:bg-cyan-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
          >
            <SendIcon />
          </button>
        </form>
      </footer>
    </div>
  );
}
