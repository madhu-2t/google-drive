// folderController.js
const File = require('../models/fileModel'); // Import the Folder model
const FileVersion = require('../models/fileVersion');
// Controller to get folders and files based on rootFolder ID
exports.giveFile = async (req, res) => {
    let { fileid,version } = req.params; 
    // Get rootFolder ID from request parameters
    console.log(`req.params ${req.params}`)
    console.log(req.user);
    try {
        console.log(fileid,version);
        // Fetch the folder and populate its files and subfolders
        if(!fileid){
            return res.status(400).json({message: "file id is required"})
        }
        let file = await File.findById(fileid)
        
            // .populate('foldersInCurrentFolder') // Populate subfolders
            // .populate('filesInCurrentFolder'); // Populate files

        if (!file) {
            return res.status(404).json({ message: 'File not found.' });
        }
        if(!version){
            // const latestVersion = await FileVersion.findOne({ 
            //     fileId: existingFile._id 
            // }).sort('-versionNumber');
            // version=latestVersion.versionNumber
            return res.status(200).json({
                message: 'as version is not specified latest File contents retrieved successfully!',
                file // Return the populated folder data
            });
        }
        const givenVersionfile = await FileVersion.findOne({ 
                fileId: file._id ,
                versionNumber:version,
            })
            // version=latestVersion.versionNumber
        

        return res.status(200).json({
            message: `File with version ${givenVersionfile.versionNumber}  retrieved successfully!`,
            givenVersionfile // Return the populated folder data
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching File contents: ' + error.message });
    }
};

