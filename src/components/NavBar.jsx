import React, { useState } from 'react';

const NavBar = ({ handleTabChange }) => {
  return (
    <nav>
      <div className="navbar-container">
        <a onClick={() => handleTabChange('home')}>XEKEX Inspector</a>
        <a onClick={() => handleTabChange('updateApp')}>Update App</a>
        <a onClick={() => handleTabChange('appDB')}>App DB</a>
      </div>
    </nav>
  );
};

export default NavBar;
