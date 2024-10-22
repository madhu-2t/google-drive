// folderController.js
const Folder = require('../models/folderModel'); // Import the Folder model
const User = require('../models/userModel');
// Controller to get folders and files based on rootFolder ID
exports.createFolder = async (req, res) => {
    let { id } = req.params; // Get folder ID from request parameters
    // console.log(req.user);
    try {
        // Fetch the folder and populate its files and subfolders
        if(!id)id=req.user.folder._id;
        const user_id=req.user.id;
        // console.log(`User id ${user_id}`);
        const newFolder = new Folder({parentFolder:id,usersAccessingThisFolder:user_id});
        const savedFolder = await newFolder.save();
        // console.log(`saved folder ${savedFolder}`)
        

        let parent_folder = await Folder.findById(id);
        // console.log(`Parent folder ${parent_folder}`)
        parent_folder.foldersInCurrentFolder.push(savedFolder._id);
        // console.log(`Parent folder ${parent_folder}`)
        await parent_folder.save();
        

        res.status(200).json({
            message: 'Folder created Successfully',
            savedFolder // Return the populated folder data
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching folder contents: ' + error.message });
    }
};

