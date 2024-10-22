const express=require("express");
const router=express.Router();


//Importing Controllers
const {userSignup,userLogin}=require("../controller/login_signup.js");
const {getFolderContents}=require("../controller/getFolderContents.js");
const {auth}=require("../middleware/auth.js")
const {createFolder}=require("../controller/createFolder.js");
//Mapping controllers
router.post("/signup",userSignup);
router.get("/login",userLogin);
router.get("/open/:id?",auth,getFolderContents);
router.get("/createFolder/:id?",auth,createFolder);

module.exports=router;