const Pincode = require("../models/Pincode");
const {ROLES} = require("../utils/constants")


const addPincode = async(req,res) =>{

    if(req.role !== ROLES.admin){
        return res.status(401).json({success:false, message:"Access denied"});
    }

    const {pincodes} = req.body;

    if(!pincodes || pincodes.length === 0){
        return res.status(400).json({message:"Please provide pincodes"});
    }

    try{
        const existingPincodes = await Pincode.find({
            Pincode: { $in: pincodes.map((p)=>p.pincode)}
        });

        const existingPincodesValues = existingPincodes.map((p)=>p.pincode)

        const newPinCodes = pincodes.filter((p)=> !existingPincodesValues.includes(p.pincode))

        if(newPinCodes.length === 0){
            return res.status(400).json({success:false, message:"All Pincodes already exists"})
        }

        await Pincode.insertMany(newPinCodes);
        
        return res.status(200).json({success:true, message:"Pincodes added successfully."})
    }catch(error){
        return res.status(500).json({success:false, message: error.message})
    }
}

const getPincode = async(req, res) =>{
    const {pincode} = req.params;

    try{
        
        const existingPincode = await Pincode.find({pincode});
        console.log("pincode",existingPincode)

        if(existingPincode.length === 0){
            return res.status(200).json({success:false, message:"No delivery available for this pincode"});
        }

        return res.status(200).json({success:true, message:"Delivery available for this pincode"});

    }catch(error){
        return res.status(500).json({success:false, message: error.message})
    }
}

module.exports = {addPincode, getPincode}
