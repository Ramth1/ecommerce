const User= require("../models/User");
const Admin= require("../models/Admin");
const bcrypt= require("bcrypt");
const jwt = require("jsonwebtoken");


const signup = async(req,res) => {
    const {name, email, password, phone} = req.body
    try{
        let user= await User.findOne({email})

        if(user) return res.status(400).json({
            success:false,
            message: "Please try again with different email",
        });

        // 123- ewreewre(hashing)
        const hashedPassword = await bcrypt.hash(password,10);

        user= new User({
            name, 
            email,
            phone,
            password: hashedPassword,
        });

        await user.save();

        return res.status(201).json({
            success:true,
            message:"User created successfully",
        });

    }catch(error){
        return res.status(500).json({success:false, message: error.message});
    }
};

const login = async(req,res) =>{
    const {email,password} = req.body;

    try{
        let user = await User.findOne({email})

        if(!user) return res.status(401).json({success:false, message:"Email doesn't exist"})
        
        const comparedPassword = await bcrypt.compare(password, user.password)
        if(!comparedPassword) 
            return res.status(400).json({success:false, message:"Password doesn't match."})

        const token = jwt.sign(
            {id:user._id, role: user.role},
            process.env.JWT_SECRET //SECRET key
        );

        return res.status(200).json({success: true, message:"User logged in successfully", token, user:{
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        }})

    }catch(error){
        return res.status(500).json({success:false, message: error.message})
    }
}

const adminSignup = async(req,res)=>{
    const {username,password} = req.body
    
    try{
        let admin= await Admin.findOne({username})

        if(admin) return res.status(400).json({sucess:false,message:"Username already used"});

        // hashed
        const securePassword = await bcrypt.hash(password,10)

        admin= new Admin({
            username,
            password,
        })

        await admin.save();

        return res.status(200).json({success:true, message:"Admin account has been successfully created"})
        

    }catch(error){
        return res.status(500).json({success:false,message:"Invalid Credentials"})
    }
}

const adminLogin = async(req,res) =>{
    const {username,password} = req.body;

    try{
        let admin = await Admin.findOne({username});

        if(!admin) return res.status(404).json({success:false,message:"Username Doesn't match"});

        const comPassword = await bcrypt.compare(password, admin.password)

        const token = jwt.sign(
            {id:admin._id, role: admin.role},
            process.env.JWT_SECRET, //SECRET key,
            {
                expiresIn:"1d",
            }
        );

        return res.status(200).json({success:true, message:"Admin logged in Successfully",
            token,
            user:{
                id: admin._id,
                username: admin.username,
                role: admin.role,
            },
        },

        );

    }catch(error){
        return res.status(500).json({success:false, message:error.message});
    }
}

module.exports = {signup, login, adminSignup, adminLogin};