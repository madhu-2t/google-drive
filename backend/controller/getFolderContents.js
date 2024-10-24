const Folder = require('../models/folderModel'); // Import the Folder model

// Helper function to get all nested folders recursively and return a fully nested structure
const getAllNestedFolders = async (folderId) => {
    // Fetch the current folder
    const folder = await Folder.findById(folderId)
        .populate('foldersInCurrentFolder') // Populate subfolders
        .populate('filesInCurrentFolder'); // Populate files
    
    if (!folder) {
        throw new Error('Folder not found.');
    }

    // Recursively fetch all subfolders and their contents
    const nestedSubfolders = await Promise.all(
        folder.foldersInCurrentFolder.map(async (subfolder) => {
            return await getAllNestedFolders(subfolder._id);
        })
    );

    // Return the folder with its nested subfolders and files
    return {
        _id: folder._id,
        folderName: folder.folderName,
        parentFolder: folder.parentFolder,
        foldersInCurrentFolder: nestedSubfolders, // Place nested subfolders here
        filesInCurrentFolder: folder.filesInCurrentFolder,
        usersAccessingThisFolder: folder.usersAccessingThisFolder,
        __v: folder.__v
    };
};

// Controller to get folders and files based on rootFolder ID
exports.getFolderContents = async (req, res) => {
    let { id } = req.params; // Get rootFolder ID from request parameters
    console.log(req.user);

    try {
        if (!id) id = req.user.folder._id;

        // Fetch all folder contents recursively
        let folderContents = await getAllNestedFolders(id);

        res.status(200).json({
            message: 'Folder contents retrieved successfully!',
            folder: folderContents // Return the fully nested folder structure
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching folder contents: ' + error.message });
    }
};
