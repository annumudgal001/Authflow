import mongoose from 'mongoose';


const userschema=mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true},
    password:{type:String,required:true,trim:true},
    tc:{type:Boolean,required:true}
})

const usermodel=mongoose.model("user",userschema)

export default usermodel;