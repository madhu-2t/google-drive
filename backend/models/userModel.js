const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    phone_no:{
        type:String,
        required:true
    },
    folder:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Folder",
    }
})

module.exports=mongoose.model("User",userSchema);