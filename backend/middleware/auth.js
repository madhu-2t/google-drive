const jwt=require("jsonwebtoken");
require("dotenv").config();

exports.auth=async(req,res,next)=>{
    try{
        const token=req.cookies.loginCookie || req.body.token || req.header("Authorization").replace("Bearer ","");
        if(!token ||token===undefined){
            return req.status(400).json({
                success:false,
                message:"Token missing",
            })
        }
        try {
            // console.log(token);
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            // console.log(decode);
            req.user=decode
        } catch (error) {
            return res.status(400).json({
                success:false,
                message:"Token invalid"
            })
        }

        next();
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"Somethign went wrong while verifying the token"
        })
    }
}