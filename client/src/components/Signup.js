import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usn, setUsn] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');  // Default role
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!username || !password || !usn || !name || !role) {
      setError('Please fill all required fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        username,
        password,
        usn,
        name,
        role,
      });

      setError(null);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err.response || err);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up (Student)</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <input
        type="text"
        placeholder="USN"
        value={usn}
        onChange={e => setUsn(e.target.value)}
      />

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      {/* If you want user to select role, else keep it fixed */}
      {/* <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="vendor">Vendor</option>
      </select> */}

      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}

export default Signup;
