import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


let transporter=nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    secure:false,
    tls:{
        rejectUnauthorized:false
    },
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
    }
})

export default transporter