import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FoldersList.css'; // Import the CSS file for styling

function FolderList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [folderName, setFolderName] = useState('');
  const token = location.state?.token; // Assuming you pass the token with state

  useEffect(() => {
    const folderData = location.state?.folder?.foldersInCurrentFolder || [];
    setFolders(folderData);
  }, [location.state]);

  const handleCreateFolderClick = () => {
    setShowInput(true); // Show the input overlay
  };

  const handleInputChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/v1/createFolder/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ folderName: folderName }), // Sending the folder name as required
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Update the folder state with the newly created folder
      setFolders((prevFolders) => [
        ...prevFolders,
        data.savedFolder, // Adjust according to your response structure
      ]);
      setFolderName(''); // Clear input
      setShowInput(false); // Hide input overlay
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };
  const handleFolderClick = async (folderId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/open/${folderId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${response.status} ${response.statusText} - ${errorData.message || ''}`);
      }

      const data = await response.json();
      navigate('/folderContents', { state: { folder: data.folder, token } }); // Navigate to the folder contents page
    } catch (error) {
      console.error('Error opening folder:', error);
    }
  };

  return (
    <div className="folder-list-container">
      <div className="folder-grid">
        {folders.length > 0 ? (
          folders.map((folder) => (
            <div key={folder._id} className="folder-card" onClick={() => handleFolderClick(folder._id)}>
              <div className="folder-icon">📁</div>
              <div className="folder-name">{folder.folderName}</div>
            </div>
          ))
        ) : (
          <p>No folders available.</p>
        )}
      </div>

      {/* Create Folder Button */}
      <button onClick={handleCreateFolderClick} className="create-folder-button">
        +
      </button>

      {/* Overlay for folder input */}
      {showInput && (
        <div className="overlay">
          <div className="overlay-content">
            <h3>Create New Folder</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter folder name"
                value={folderName}
                onChange={handleInputChange}
                required
              />
              <button type="submit">Create</button>
            </form>
            <button onClick={() => setShowInput(false)} className="close-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FolderList;
