const mongoose = require("mongoose")

const pincodeSchema = mongoose.Schema({
    pincode:{
        type:String,
        required:true,
        unique:true,
    }
},{timestamps:true})

const Pincode = mongoose.model("Pincode",pincodeSchema)
module.exports = Pincode