const mongoose=require("mongoose");
require("dotenv").config();

const dbConnect=async()=>{
    console.log('Connecting to MongoDB...');
    console.log(process.env.MONGODB_URL)
    await mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{console.log(`DataBase Connected Successfull`);})
    .catch((error)=>{
        console.log(`Error Connecting to Database`)
        process.exit(1);
    })
}
module.exports=dbConnect;