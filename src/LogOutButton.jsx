// src/LogOutButton.jsx
import React from 'react';
import { logOut } from './auth';

function LogOutButton() {
  const handleLogOut = async () => {
    await logOut();
    alert('Logged Out!');
  };

  return <button onClick={handleLogOut}>Log Out</button>;
}

export default LogOutButton;
