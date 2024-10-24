// CreateFolder.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation to access passed state

function CreateFolder() {
  const [folderName, setFolderName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const location = useLocation(); // Access state passed from the login/signup
  const parentFolderId = location.state?.parentFolderId; // Extract parentFolderId from state

  const handleCreateFolderClick = () => {
    setShowInput(true); // Show input when button is clicked
  };

  const handleInputChange = (e) => {
    setFolderName(e.target.value); // Update folder name state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!folderName) {
      alert('Please provide a folder name');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/createFolder/${parentFolderId || ''}`, // Include parentFolderId if it exists
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token if required
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            folderName: folderName, // Send folder name in the body
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Folder created successfully!', data);
      alert(`Folder "${folderName}" created successfully!`);
      setFolderName(''); // Clear the input after folder creation
      setShowInput(false); // Hide input
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder');
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {/* Floating Button */}
      <button
        onClick={handleCreateFolderClick}
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          padding: '10px 20px',
          borderRadius: '50%',
          backgroundColor: '#007BFF',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
        }}
      >
        +
      </button>

      {/* Folder name input when button is clicked */}
      {showInput && (
        <div style={{ position: 'fixed', right: '20px', bottom: '70px' }}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter folder name"
              value={folderName}
              onChange={handleInputChange}
              required
              style={{
                padding: '10px',
                fontSize: '16px',
              }}
            />
            <button type="submit" style={{ marginLeft: '10px' }}>Create</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CreateFolder;
