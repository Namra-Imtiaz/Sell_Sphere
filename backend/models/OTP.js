const mongoose=require("mongoose")
const {Schema}=mongoose

const otpSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:false
    },
    otp:{
        type:String,
        required:false
    },
    expiresAt:{
        type:Date,
        required:false
    },
})



module.exports=mongoose.model("OTP",otpSchema)