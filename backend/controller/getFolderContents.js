// folderController.js
const Folder = require('../models/folderModel'); // Import the Folder model

// Controller to get folders and files based on rootFolder ID
exports.getFolderContents = async (req, res) => {
    let { id } = req.params; // Get rootFolder ID from request parameters
    console.log(req.user);
    try {
        // Fetch the folder and populate its files and subfolders
        if(!id)id=req.user.folder._id;
        let folder = await Folder.findById(id)
            // .populate('foldersInCurrentFolder') // Populate subfolders
            // .populate('filesInCurrentFolder'); // Populate files

        if (!folder) {
            return res.status(404).json({ message: 'Folder not found.' });
        }

        res.status(200).json({
            message: 'Folder contents retrieved successfully!',
            folder // Return the populated folder data
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching folder contents: ' + error.message });
    }
};

