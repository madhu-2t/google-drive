import React from 'react';
import { useLocation } from 'react-router-dom';
import './FolderContents.css'; // Import the CSS file for styling

function FolderContents() {
  const location = useLocation();
  const { folder} = location.state; // Access the folder data passed from FolderList

  return (
    <div className="folder-contents-container">
      <h2>Contents of {folder.folderName}</h2>
      <h3>Subfolders:</h3>
      <div className="folder-grid">
        {folder.foldersInCurrentFolder.length > 0 ? (
          folder.foldersInCurrentFolder.map((subFolder) => (
            <div key={subFolder._id} className="folder-card">
              <div className="folder-icon">📁</div>
              <div className="folder-name">{subFolder.folderName}</div>
            </div>
          ))
        ) : (
          <p>No subfolders available.</p>
        )}
      </div>
      <h3>Files:</h3>
      <div className="file-grid">
        {folder.filesInCurrentFolder.length > 0 ? (
          folder.filesInCurrentFolder.map((file) => (
            <div key={file._id} className="file-card">
              <div className="file-icon">📄</div>
              <div className="file-name">{file.fileName}</div>
            </div>
          ))
        ) : (
          <p>No files available.</p>
        )}
      </div>
    </div>
  );
}

export default FolderContents;
