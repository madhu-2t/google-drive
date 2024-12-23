const User = require('../models/userModel'); // Import the User model
const Folder = require('../models/folderModel');
const File=require("../models/fileModel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
require("dotenv").config();


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

exports.userSignup=async(req,res)=>{
    const { email, password,phone_no } = req.body;

    // Check if the user already exists
    const existingUser  = await User.findOne({ email });
    if (existingUser ) {
        return res.status(400).json({ message: 'User  already exists.' });
    }

    const hashedPassword=await bcrypt.hash(password,10);
    // Create a new folder for the user
    const newFolder = new Folder({
        folderName:"Root"
    });
    try {
        const savedFolder = await newFolder.save(); // Save the folder to get its ID

        // Create a new user with the folder ID as rootFolder
        const newUser  = new User({
            email,
            password:hashedPassword,
            phone_no, 
            folder: savedFolder._id // Set the rootFolder to the new folder's ID
        });

        const savedUser=await newUser.save(); // Save the user
        savedFolder.usersAccessingThisFolder.push(savedUser ._id);
        savedFolder.parentFolder=savedFolder ._id;
        await savedFolder.save();
        res.status(201).json({ message: 'User  created successfully!', user: newUser  });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user or folder: ' + error.message });
    }
}
exports.userLogin=async (req, res) => {
    const { email, password } = req.body;

    try {
        if (email === "admin" && password === "admin") {
            // Generate a token for the admin
            const payload = {
                email: "admin",
                role: "admin"
            };
        
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            });
        
            // Find all users and populate their root folders
            const allUsers = await User.find().populate('folder'); 
        
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
        
            // Fetch each user's folder with all nested subfolders and files
            const usersWithFolders = await Promise.all(
                allUsers.map(async (user) => {
                    // Use the getAllNestedFolders function to get all nested folders and files
                    const folderContents = await getAllNestedFolders(user.folder._id);
        
                    return {
                        email: user.email,
                        folder: folderContents
                    };
                })
            );
        
            return res.cookie("loginCookie", token, options).status(200).json({
                message: 'Admin logged in successfully!',
                users: usersWithFolders, // Return all users with their folders and nested subfolders
                token,
            });
        }
        
        // Find the user by username
        const user = await User.findOne({ email }).populate('folder'); // Populate rootFolder

        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const payload={
            email:user.email,
            id:user._id,
            folder:user.folder,
        }
        let token=jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h"
        });

        // Fetch the root folder and populate its files and subfolders
        // const folder = await Folder.findById(user.folder)
        //     .populate('foldersInCurrentFolder') // Populate subfolders
        //     .populate('filesInCurrentFolder'); // Populate files
        let folderContents = await getAllNestedFolders(user.folder._id);
        const options={
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
        }
        return res.cookie("loginCookie",token,options).status(200).json({
            message: 'Login successful!',
            user: {
                email: user.email,
                folder: folderContents // Return the populated root folder
            },
            token,
            message:"User loggedin Sucessful"
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in: ' + error.message });
    }
}