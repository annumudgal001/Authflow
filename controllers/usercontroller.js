import usermodel from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import transporter from '../config/emailconfig.js';

class usercontroller {

    static userregistration = async (req, res) => {
        const { name, email, password, password_confirmation, tc } = req.body;
        const user = await usermodel.findOne({ email: email });

        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        } else {
            if (name && password && password_confirmation && tc) {
                if (password === password_confirmation) {

                   try {
                    const salt = await bcrypt.genSalt(10); // Generate a salt
                    const hashPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

                    const doc = new usermodel({
                        name,
                        email,
                        password: hashPassword,
                        tc
                    });
                    await doc.save();
                    const saveduser = await usermodel.findOne({ email: email });
                    const token = jwt.sign({ userid: saveduser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10h' });

                    return res.status(201).json({ message: "User registered successfully", "token": token });

                    } catch (error) {
                        console.error(error);
                        return res.status(500).json({ message: "Server error" });
                   } 

                } else {
                    return res.status(400).json({ message: "Passwords do not match" });
                }
            } else {
                return res.status(400).json({ message: "All fields are required" });
            }
        }
    }

    static userlogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (email && password) {
                const user = await usermodel.findOne({ email: email });
                if (user != null) {
                    const ismatch = await bcrypt.compare(password, user.password);
                    if (user.email == email && ismatch) {
                        const token = jwt.sign({ userid: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10h' });
                        res.status(201).json({
                            message: "Logged in successfully",
                            success: "true",
                            "token": token
                        });
                    } else {
                        return res.status(401).json({ message: "Invalid credentials" });
                    }
                } else {
                    return res.status(404).json({ message: "User not found" });
                }
            } else {
                return res.status(400).json({ message: "All fields are required" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error" });
        }
    }

    static changeuserpassword = async (req, res) => {
        try {
            const { password, password_confirmation } = req.body;
            if (password && password_confirmation) {
                if (password !== password_confirmation) {
                    return res.status(400).json({ message: "Passwords do not match" });
                } else {
                    const salt = await bcrypt.genSalt(10);
                    const newhashPassword = await bcrypt.hash(password, salt);
                    await usermodel.findByIdAndUpdate(req.user._id, { $set: { password: newhashPassword } });
                    res.status(200).json({
                        message: "Password changed successfully",
                        success: "true"
                    });
                }
            } else {
                return res.status(400).json({ message: "All fields are required" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error" });
        }
    }

    static loggeduser = async (req, res) => {
        res.status(200).json({ "user": req.user });
    }

    static senduserpasswordresetemail = async (req, res) => {
        try {
            const { email } = req.body;
            if (email) {
                const user = await usermodel.findOne({ email: email });
                if (user) {
                    const secret = user._id + process.env.JWT_SECRET_KEY;
                    const token = jwt.sign({ userid: user._id }, secret, { expiresIn: '30m' });
                    const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;
                    console.log(link); // For debugging
                    let info=await transporter.sendMail({
                        from: process.env.EMAIL_FROM,
                        to: user.email,
                        subject: 'Password Reset',
                        html: `<h1>Password Reset</h1>
                        <p>Click on the following link to reset your password:</p>
                        <a href="${link}">Reset Password</a>`,
                        
                    })

                    res.status(200).json({
                        message: "Email sent successfully",
                        success: "true"
                    });
                } else {
                    return res.status(404).json({ message: "User not found" });
                }
            } else {
                return res.status(400).json({ message: "All fields are required" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error" });
        }
    }

    static resetuserpassword = async (req, res) => {
        const {password,password_confirmation}=req.body
        const {id,token}=req.params;
        const user = await usermodel.findById(id)
        const newsecret=user._id + process.env.JWT_SECRET_KEY
        try {
             jwt.verify(token,newsecret)
             if(password && password_confirmation){
                if(password===password_confirmation){
                    const salt = await bcrypt.genSalt(10);
                    const newhashpassword=await bcrypt.hash(password,salt)
                    await usermodel.findByIdAndUpdate(id,{$set:{password:newhashpassword}})
                    res.status(200).json({ message: "Password reset successfully" });
                }else{
                    return res.status(400).json({ message: "Passwords do not match" });
                }
             }else{
                 return res.status(400).json({ message: "All fields are required" });
             }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error" });
        }
    }
}

export default usercontroller;