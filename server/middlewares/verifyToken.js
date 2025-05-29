const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) =>{
    const token = req.cookies?.token || req.header("Authorization")?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            success:false,
            message:"Unauthorized request"
        });
    }

    try{

        jwt.verify(token,process.env.JWT_SECRET,(error, user)=>{

            if(error){
                return res.status(400).json({success:false, message: "Invalid token"})
            }

            req.id= user._id;
            req.role= user.role;
            next();
        });
        

    }catch(error){
        return res.status(500).json({success:false, message:error.message})
    }
}

module.exports = verifyToken;