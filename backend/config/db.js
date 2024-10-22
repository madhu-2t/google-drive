const mongoose=require("mongoose");
require("dotenv").config();

const dbConnect=async()=>{
    await mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{console.log(`DataBase Connected Successfull`);})
    .catch((error)=>{
        console.log(`Error Connecting to Database`)
        process.exit(1);
    })
}
module.exports=dbConnect;