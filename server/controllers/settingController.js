const {ROLES} = require("../utils/constants");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");


const changeUsername = async(req,res)=>{

    if(req.role !== ROLES.admin){
        return res.status(401).json({success:false, message:"Access denied"});
    }

    try {
        const {previousUsername, newUsername} = req.body
        

        if(!newUsername){
            return res.status(400).json({success:false, message: "Username to change is required"});
        }

        const user= await Admin.findOneAndUpdate({username: previousUsername},{username: newUsername}, {new:true})

        if(!user){
            return res.status(404).json({success:false, message:"Username doesn't exist"})
        }

        return res.status(200).json({success:true, message: `New username is ${username}`})
    } catch (error) {
        return res.status(500).json({success:false, message:error.message});
    }

}

const changePassword = async(req,res) =>{
    if(req.role !== ROLES.admin){
        return res.status(401).json({success:false, message: "Access denied"});
    }

    try {
        const {username, previousPassword, newPassword} = req.body;

        if(!previousPassword || !newPassword){
            return res.status(400).json({success:false, message:"Previous and new password is required"});
        }

        let user = await Admin.findOne({username});
        if(!user){
            return res.status(404).json({success:false, message:"User doesn't exist"});
        }

        const validPassword = await bcrypt.compare(previousPassword, user.password);

        if(!validPassword){
            return res.status(400).json({success:false, message:"Invalid password"});
        }

        const securedPassword = await bcrypt.hash(newPassword,10);

        user.password = securedPassword;

        await user.save();

        return res.status(200).json({success:true, message:"Password Changed successfully"});
        
    } catch (error) {
        return res.status(500).jso({success:false, message: error.message});
    }
}

module.exports = {changeUsername, changePassword}