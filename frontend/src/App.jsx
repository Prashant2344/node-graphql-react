import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventPage from './pages/Event';
import BookingPage from './pages/Booking';
import MainNavigation from './components/Navigation/MainNavigation';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <MainNavigation/>
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/events" element={<EventPage/>} />
        <Route path="/bookings" element={<BookingPage/>} />
      </Routes>
    </main>
    </BrowserRouter>
  )
}

export default App
