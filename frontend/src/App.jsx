import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import EventDetails from './pages/EventDetails';
import MyEvents from './pages/MyEvents';
import AdminDashboard from './pages/AdminDashboard';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';
import RegisteredStudents from './pages/RegisteredStudents';

function App() {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('currentUser');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student-dashboard" element={<StudentDashboard user={user} />} />
        <Route path="/event-details/:id" element={<EventDetails user={user} />} />
        <Route path="/my-events" element={<MyEvents user={user} />} />
        <Route path="/admin-dashboard" element={<AdminDashboard user={user} />} />
        <Route path="/add-event" element={<AddEvent user={user} />} />
        <Route path="/edit-event/:id" element={<EditEvent user={user} />} />
        <Route path="/registered-students/:id" element={<RegisteredStudents user={user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer>
        <p>&copy; 2026 College Event Management System | React + Spring Boot Project Submission</p>
      </footer>
    </BrowserRouter>
  );
}

export default App;
