const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    amount:{
        type:Number,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    khaltiPaymentId: {
        type: String,
        
    },
    khaltiToken: {
        type: String,
        
    },
    products:[
        {
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },
            quantity:{
                type:Number,
                required:true,
            },
            color:{
                type:String,
                required:true
            }
        }
    ],
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status: {
        type: String,
        enum: ["pending", "paid", "packed", "in transit", "completed", "failed"],
        default: "pending"
    }
},{timestamps:true})

const Order= mongoose.model("Order", orderSchema)
module.exports= Order