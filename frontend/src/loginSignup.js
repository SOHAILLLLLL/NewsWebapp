import React, { useState, useEffect } from 'react';

// Main App component
const Auth = () => {
    // State to manage the current view: 'login', 'signup', or 'dashboard'
    const [view, setView] = useState('login');
    // State to store the authentication token
    const [token, setToken] = useState(localStorage.getItem('authToken') || null);
    // State to store user information (e.g., username, ID)
    const [userInfo, setUserInfo] = useState(null);
    // State for displaying messages to the user
    const [message, setMessage] = useState('');

    // Base URL for your Django backend API
    // IMPORTANT: Replace this with the actual URL of your running Django backend
    const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Example: adjust as needed

    // Effect to check if a token exists on component mount and try to fetch user info
    useEffect(() => {
        if (token) {
            // If a token exists, try to fetch user information
            fetchUserInfo(token);
            setView('dashboard'); // Assume logged in if token exists
        }
    }, [token]); // Re-run if token changes

    // Function to handle user login
    const handleLogin = async (username, password) => {
        setMessage(''); // Clear previous messages
        try {
            const response = await fetch(`${API_BASE_URL}/auth/token/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // If login is successful, store the token
                const newToken = data.auth_token;
                localStorage.setItem('authToken', newToken);
                setToken(newToken);
                setMessage('Login successful!');
                fetchUserInfo(newToken); // Fetch user info immediately after login
                setView('dashboard');
            } else {
                // Handle login errors (e.g., invalid credentials)
                setMessage(`Login failed: ${data.non_field_errors ? data.non_field_errors[0] : 'Please check your credentials.'}`);
                console.error('Login error:', data);
            }
        } catch (error) {
            setMessage('An error occurred during login. Please try again.');
            console.error('Network error during login:', error);
        }
    };

    // Function to handle user signup
    const handleSignup = async (username, email, password, re_password) => {
        setMessage(''); // Clear previous messages
        try {
            console.log(password, re_password);
          if (password !== re_password) {
            setMessage('Passwords do not match. Please try again.');
            return;
          }
          if (!username || !email || !password) {
            setMessage('All fields are required. Please fill them out.');
            return;
          }
            const response = await fetch(`http://localhost:8000/api/auth/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, re_password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Signup successful! You can now log in.');
                setView('login'); // Redirect to login after successful signup
            } else {
                // Handle signup errors (e.g., username already taken, password mismatch)
                const errorMessages = Object.values(data).flat().join(' ');
                setMessage(`Signup failed: ${errorMessages}`);
                console.error('Signup error:', data);
            }
        } catch (error) {
            setMessage('An error occurred during signup. Please try again.');
            console.error('Network error during signup:', error);
        }
    };

    // Function to fetch user information using the token
    const fetchUserInfo = async (authToken) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/users/me/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`, // Use Token authentication
                },
            });

            const data = await response.json();

            if (response.ok) {
                setUserInfo(data);
            } else {
                // If token is invalid or expired, clear it and go to login
                localStorage.removeItem('authToken');
                setToken(null);
                setUserInfo(null);
                setView('login');
                setMessage('Your session expired. Please log in again.');
                console.error('Failed to fetch user info:', data);
            }
        } catch (error) {
            setMessage('An error occurred while fetching user information.');
            console.error('Network error fetching user info:', error);
            localStorage.removeItem('authToken');
            setToken(null);
            setUserInfo(null);
            setView('login');
        }
    };

    // Function to handle user logout
    const handleLogout = async () => {
        setMessage(''); // Clear previous messages
        try {
            // Djoser's logout endpoint requires a POST request with the token
            await fetch(`${API_BASE_URL}/auth/token/logout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
            });
            // Even if the backend call fails, clear the local token
            localStorage.removeItem('authToken');
            setToken(null);
            setUserInfo(null);
            setMessage('You have been logged out.');
            setView('login');
        } catch (error) {
            // In case of network error, still clear local token
            localStorage.removeItem('authToken');
            setToken(null);
            setUserInfo(null);
            setMessage('Logout successful, but a network error occurred.');
            setView('login');
            console.error('Network error during logout:', error);
        }
    };

    // Login Form Component
    const LoginForm = ({ onLogin, onSwitchToSignup, message }) => {
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');

        const handleSubmit = (e) => {
            e.preventDefault();
            onLogin(username, password);
        };

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
                    {message && (
                        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-md relative mb-4" role="alert">
                            <span className="block sm:inline">{message}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105"
                            type="submit"
                        >
                            Log In
                        </button>
                    </form>
                    <p className="text-center text-gray-600 text-sm mt-6">
                        Don't have an account?{' '}
                        <button
                            onClick={onSwitchToSignup}
                            className="text-blue-600 hover:text-blue-800 font-semibold focus:outline-none"
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        );
    };

    // Signup Form Component
    const SignupForm = ({ onSignup, onSwitchToLogin, message }) => {
        const [username, setUsername] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [re_password, setRePassword] = useState('');

        const handleSubmit = (e) => {
            e.preventDefault();
            onSignup(username, email, password, re_password);
        };

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
                    {message && (
                        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-md relative mb-4" role="alert">
                            <span className="block sm:inline">{message}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="signup-username">
                                Username
                            </label>
                            <input
                                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                id="signup-username"
                                type="text"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="signup-email">
                                Email
                            </label>
                            <input
                                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                id="signup-email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="signup-password">
                                Password
                            </label>
                            <input
                                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                id="signup-password"
                                type="password"
                                placeholder="Choose a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="signup-re-password">
                                Confirm Password
                            </label>
                            <input
                                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                id="signup-re-password"
                                type="password"
                                placeholder="Re-enter your password"
                                value={re_password}
                                onChange={(e) => setRePassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105"
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </form>
                    <p className="text-center text-gray-600 text-sm mt-6">
                        Already have an account?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="text-blue-600 hover:text-blue-800 font-semibold focus:outline-none"
                        >
                            Log In
                        </button>
                    </p>
                </div>
            </div>
        );
    };

    // Dashboard Component (displayed after successful login)
    const Dashboard = ({ userInfo, onLogout, message }) => {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome!</h2>
                    {message && (
                        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-md relative mb-4" role="alert">
                            <span className="block sm:inline">{message}</span>
                        </div>
                    )}
                    {userInfo ? (
                        <div className="text-gray-700 text-lg mb-6">
                            <p>You are logged in as:</p>
                            <p className="font-semibold text-xl">{userInfo.username}</p>
                            <p className="text-sm">User ID: {userInfo.id}</p>
                            <p className="text-sm">Email: {userInfo.email}</p>
                        </div>
                    ) : (
                        <p className="text-gray-600 mb-6">Loading user information...</p>
                    )}
                    <button
                        onClick={onLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        );
    };

    // Render the appropriate component based on the current view
    switch (view) {
        case 'login':
            return <LoginForm onLogin={handleLogin} onSwitchToSignup={() => setView('signup')} message={message} />;
        case 'signup':
            return <SignupForm onSignup={handleSignup} onSwitchToLogin={() => setView('login')} message={message} />;
        case 'dashboard':
            return <Dashboard userInfo={userInfo} onLogout={handleLogout} message={message} />;
        default:
            return <LoginForm onLogin={handleLogin} onSwitchToSignup={() => setView('signup')} message={message} />;
    }
};

export default Auth;
