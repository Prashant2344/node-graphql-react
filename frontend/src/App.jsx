import React,{ Component, useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventPage from './pages/Event';
import BookingPage from './pages/Booking';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

class App extends Component {
  state = {
    token: null,
    userId: null
  }
  login = (token, userId, tokenExpiration) => {
    this.setState({token:token, userId: userId});
  }
  logout = () => {
    this.setState({token:null, userId: null});
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token:this.state.token,
              userId: this.state.userId,
              login:this.login,
              logout: this.logout
              }}
            >
          <MainNavigation/>
          <main className="main-content">
            <Routes>
              {this.state.token && (
                <Route path="/" element={<Navigate to="/events" replace />} />
              )}
              {this.state.token && (
                <Route path="/auth" element={<Navigate to="/events" replace />} />
              )}
              {!this.state.token && (
                <Route path="/auth" element={<AuthPage />} />
              )}
              <Route path="/events" element={<EventPage/>} />
              {this.state.token && (
                <Route path="/bookings" element={<BookingPage/>} />
              )}
              {!this.state.token && (
                <Route path="*" element={<Navigate to="/auth" replace />} />
              )}
            </Routes>
          </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App
