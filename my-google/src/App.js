import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import FolderContents from './components/FolderContents';
import './App.css'; // Import the CSS file for styling
import FolderList from './components/FoldersList';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <Link to="/signup" className="nav-button">Signup</Link>
          <Link to="/login" className="nav-button">Login</Link>
        </nav>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/folders/" element={<FolderList />} />
          <Route path="/folderContents" element={<FolderContents />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
