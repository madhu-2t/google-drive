import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FoldersList.css'; // Import the CSS file for styling

function FolderList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null); // Track the current folder level

  const token = location.state?.token;

  useEffect(() => {
    const folderData = location.state?.folder;
    setCurrentFolder(folderData);
    setFolders(folderData?.foldersInCurrentFolder || []);
  }, [location.state]);

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder); // Set the clicked folder as the current folder
    setFolders(folder.foldersInCurrentFolder || []); // Load subfolders, if any
    navigate('/folder', { state: { folder } }); // Navigate to the same route to update the state
  };

  const renderFolders = (folders) => {
    return folders.map((folder) => (
      <div key={folder._id} className="folder-container">
        <div className="folder-card" onClick={() => handleFolderClick(folder)}>
          <div className="folder-icon">📁</div>
          <div className="folder-name">{folder.folderName}</div>
        </div>
        {folder.subfolders && folder.subfolders.length > 0 && (
          <div className="subfolders">
            {renderFolders(folder.subfolders)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div>
      <h2>{currentFolder ? currentFolder.folderName : 'Folders'}</h2>
      {folders.length > 0 ? (
        renderFolders(folders)
      ) : (
        <p>No folders available.</p>
      )}
    </div>
  );
}

export default FolderList;
