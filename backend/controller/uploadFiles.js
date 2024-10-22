const File = require('../models/fileModel');
const Folder = require('../models/folderModel');
const FileVersion = require('../models/fileVersion');

exports.uploadFile = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }
//   console.log(req);
  let { id } = req.params;
  if(!id)id=req.user.folder._id;
  const user_id=req.user.id;
  
  const uploadedFile = req.files.file;
  console.log(uploadedFile)
//   const folderId = req.body.folderId; // Assuming you're sending the folder ID in the request body

  try {
    const existingFile = await File.findOne({ 
        filename: uploadedFile.name,
        usersAccessingThisFile: user_id
      });
  
      if (existingFile) {
        // Create a new version of the file
        const latestVersion = await FileVersion.findOne({ 
            fileId: existingFile._id 
        }).sort('-versionNumber');
        
        const newVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;

        // Save the current version to version history
        const newVersion = new FileVersion({
            fileId: existingFile._id,
            versionNumber: newVersionNumber,
            data: uploadedFile.data,
            contentType: uploadedFile.mimetype,
            size: uploadedFile.size,
            createdBy: user_id
        });

        await newVersion.save();

        // Update the existing file
        existingFile.contentType = uploadedFile.mimetype;
        existingFile.data = uploadedFile.data;
        existingFile.size = uploadedFile.size;
        existingFile.updatedAt = Date.now();

        const updatedFile = await existingFile.save();
        
        return res.status(200).json({ 
            message: 'File updated successfully with new version', 
            file: updatedFile,
            versionNumber: newVersionNumber,
            updated: true 
        });
    }







    // If no existing file, create a new one
    const newFile = new File({
        filename: uploadedFile.name,
        contentType: uploadedFile.mimetype,
        data: uploadedFile.data,
        size: uploadedFile.size,
        usersAccessingThisFile: [user_id],
    });

    const savedFile = await newFile.save();

    // Create initial version (version 1)
    const initialVersion = new FileVersion({
        fileId: savedFile._id,
        versionNumber: 1,
        data: uploadedFile.data,
        contentType: uploadedFile.mimetype,
        size: uploadedFile.size,
        createdBy: user_id
    });

    await initialVersion.save();

    // Update the folder to include this file
    await Folder.findByIdAndUpdate(id, {
        $push: { filesInCurrentFolder: savedFile._id } });

    res.status(200).json({ 
        message: 'File uploaded successfully with initial version', 
        file: savedFile,
        versionNumber: 1,
        updated: false 
    });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error uploading file: ' + error.message 
        });
    }

};