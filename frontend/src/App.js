import logo from './logo.svg';
import './App.css';
import Auth from './loginSignup';
import Navbar from './navbar';
import { useState, useEffect } from 'react';
// import NewsShow from './cards'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chatbot from './chatbot';
// import ArticleDetail from './detail'
import { NewsShow, ArticleDetail, Search } from './cards';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for token in localStorage when the app loads
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log(token);
    console.log("token here");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  const navLinks = ['home', 'chatbot', 'bussiness', 'entertaiment', 'politics', 'sport', 'tech',];

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/:article_type" element={<NewsShow />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/search/:query" element={<Search />} />
      </Routes>
    </Router>

  );
}

export default App;
