import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import AuthPage from './pages/Auth';
import EventPage from './pages/Event';
import BookingPage from './pages/Booking';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  
  // Check if the user is authenticated (on component mount)
  useEffect(() => {
    // Send a request to the backend to check if the token is valid (it will be automatically sent with the request if present)
    axios
      .get('http://localhost:5000/protected', { withCredentials: true }) // Check if the user is authenticated
      .then((response) => {
        setToken(response.data.token); // Assuming the backend sends the token and userId
        setUserId(response.data.userId);
      })
      .catch((error) => {
        setToken(null);
        setUserId(null);
      });
  }, []);

  const login = (token, userId) => {
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    // Log out by clearing the token and userId from state
    setToken(null);
    setUserId(null);
    // Optionally, clear the cookie if necessary by calling an API to log out
    axios.post('http://localhost:5000/logout', {}, { withCredentials: true }).catch((err) => console.error(err));
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ token, userId, login, logout }}>
        <MainNavigation />
        <main className="main-content">
          <Routes>
            {/* If not authenticated, redirect to /auth */}
            {!token && <Route path="/" element={<Navigate to="/auth" replace />} />}

            {/* If authenticated, redirect to /events */}
            {token && <Route path="/" element={<Navigate to="/events" replace />} />}
            
            {/* Auth Page (only visible if not logged in) */}
            {!token && <Route path="/auth" element={<AuthPage />} />}
            
            {/* Event and Booking pages */}
            {token && <Route path="/events" element={<EventPage />} />}
            {token && <Route path="/bookings" element={<BookingPage />} />}
          </Routes>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

export default App;
