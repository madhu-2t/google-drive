const mongoose=require("mongoose");
const folderSchema=new mongoose.Schema({
    folderName:{
        type:String,
        required:true,
    },
    parentFolder:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Folder",
    },
    foldersInCurrentFolder:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Folder",
    }],
    filesInCurrentFolder:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"File",
    }],
    usersAccessingThisFolder:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }]

})
module.exports=mongoose.model("Folder",folderSchema);