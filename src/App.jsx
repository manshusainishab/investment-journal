import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import DecisionForm from './DecisionForm'; // Decision logging form
import { onAuthStateChangedListener, logoutUser } from './firebase';
import ReflectiveDashboard from './ReflectiveDashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(setUser);
    return unsubscribe; // Cleanup listener on unmount
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <Router>
      <div>
        {!user ? (
          <Routes>
           
            <Route path="/" element={<SignIn setUser={setUser} />} />
            <Route path="/signup" element={<SignUp setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <>
            <button onClick={handleLogout} style={{ margin: '10px' }}>Logout</button>
            <Routes>
              
              <Route path="/dashboard" element={<ReflectiveDashboard />} />
              <Route path="/log-decision" element={<DecisionForm user={user} />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
