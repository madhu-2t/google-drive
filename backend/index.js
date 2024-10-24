const express=require("express");
const cors = require("cors"); 
const app=express();
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

require("dotenv").config();

const PORT=process.env.PORT;
console.log(PORT);

app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());


//Connecting to database
const dbConnection=require("./config/db.js")
dbConnection();

//Import the router and assign the version of api
const todoRoutes=require("./routes/routes.js");
app.use("/api/v1",todoRoutes);



//Starting the server
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
})