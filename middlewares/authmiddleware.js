import jwt from 'jsonwebtoken';
import usermodel from '../models/user.js';


const checkuserauth=async(req,res,next)=>{
     let token
     const {authorization} =req.headers 
     if(authorization && authorization.startsWith('Bearer')){
        try {
            token=authorization.split(" ")[1]

            const {userid}=jwt.verify(token,process.env.JWT_SECRET_key)
            if(!{userid}){res.json({message:'token not verified'})}

            req.user=await usermodel.findById(userid).select('-password')
            next();
        } catch (error) {
            console.error(error)
            return res.status(401).json({message:"Invalid token"})
 
        }
     }else{
         return res.status(401).json({message:"No token provided"})
     }
}

export default checkuserauth;