const express=require("express");
const router=express.Router();


//Importing Controllers
const {userSignup,userLogin}=require("../controller/login_signup.js");
const {getFolderContents}=require("../controller/getFolderContents.js");
const {auth}=require("../middleware/auth.js")
const {createFolder}=require("../controller/createFolder.js");
const {uploadFile}=require("../controller/uploadFiles.js");
const {giveFile}=require("../controller/giveFile.js");
//Mapping controllers
router.post("/signup",userSignup);
router.post("/login",userLogin);
router.get("/open/:id?",auth,getFolderContents);
router.post("/createFolder/:id?",auth,createFolder);
router.post("/uploadFile/:id?",auth,uploadFile);
router.post("/getfile/:fileid?/:version?",auth,giveFile);

module.exports=router;