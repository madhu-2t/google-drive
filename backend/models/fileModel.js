const mongoose=require("mongoose");
const fileSchema=new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        unique: true
    },
    contentType: {
        type: String,
        required: true
    },
    data: {
        type: Buffer, // Store the file data as a Buffer
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    usersAccessingThisFile:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }]
})
module.exports=mongoose.model("File",fileSchema);