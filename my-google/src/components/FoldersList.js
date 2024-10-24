import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FoldersList.css'; // Import the CSS file for styling

function FolderList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const token = location.state?.token;

  useEffect(() => {
    const folderData = location.state?.folder;
    setFolders(folderData?.foldersInCurrentFolder || []);
  }, [location.state]);

  const handleFolderClick = (folder) => {
    navigate('/folder', { state: { folder } }); // Navigate to FolderContents, passing the clicked folder
  };

  return (
    <div>
      <h2>Folders</h2>
      {folders.length > 0 ? (
        folders.map((folder) => (
          <div
            key={folder._id}
            className="folder-card"
            onClick={() => handleFolderClick(folder)}
          >
            <div className="folder-icon">📁</div>
            <div className="folder-name">{folder.folderName}</div>
          </div>
        ))
      ) : (
        <p>No folders available.</p>
      )}
    </div>
  );
}

export default FolderList;
