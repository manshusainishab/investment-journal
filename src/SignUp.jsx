import React, { useState } from 'react';
import { registerUser } from './firebase';
import './common.css'; 
import { Link } from 'react-router-dom';

function SignUp({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await registerUser(email, password);
      setUser(userCredential.user);
    } catch (err) {
      setError('An error occurred during sign up. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p>
        Already have an account?{' '}
        <Link to="/" style={{ textDecoration: 'underline' }}>Sign In</Link>
      </p>
    </div>
  );
}

export default SignUp;
