import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './Styles/Global.css';
import NavBar from './components/NavBar';
import FileUploader from './components/FileUploader';
import AppsDataSet from './components/AppsDataSet';

const App = () => {
  const [tab, setTab] = useState('home');

  const handleTabChange = (selectedTab) => {
    setTab(selectedTab);
  };

  let displayedComponent;

  if (tab === 'home') {
    displayedComponent = null; // No component to display on the home tab
  } else if (tab === 'updateApp') {
    displayedComponent = <FileUploader />;
  } else if (tab === 'appDB') {
    displayedComponent = <AppsDataSet />;
  }

  return (
    <div className="App">
      <NavBar handleTabChange={handleTabChange} />
      {displayedComponent}
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
