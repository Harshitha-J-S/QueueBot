import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import VendorLogin from './components/VendorLogin';
import Signup from './components/Signup';
import Feedback from './components/Feedback';
import StudentDashboard from './components/StudentDashboard';
import VendorDashboard from './components/VendorDashboard';
import './styles/main.css';



function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    // Show login/signup screens when not logged in
    return (
      <Router>
        <div className="app-container">
          <img src="/logo.png" alt="Ramaiah Institute of Technology" className="logo" />

          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/vendor-login" element={<VendorLogin onLoginSuccess={setUser} />} />
            <Route path="/signup" element={<Signup />} />

            {/* Redirect root and unknown routes to login */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>

          <Feedback />
        </div>
      </Router>
    );
  }

  // When logged in, route to dashboards based on user role
  return (
    <Router>
      <div className="app-container">
        <img src="/logo.png" alt="Ramaiah Institute of Technology" className="logo" />

        <Routes>
          {user.role === 'student' && <Route path="/" element={<StudentDashboard usn={user.usn} />} />}
          {user.role === 'vendor' && <Route path="/" element={<VendorDashboard shopNumber={user.shop_number} />} />}

          {/* Redirect unknown routes to dashboard */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <Feedback />
      </div>
    </Router>
  );
}

export default App;
