import express from "express"
const router=express.Router();
import usercontroller from "../controllers/usercontroller.js";
import checkuserauth from '../middlewares/authmiddleware.js'

router.use("/changepassword",checkuserauth)
router.use("/loggeduser",checkuserauth)


//public routes

router.post("/register",usercontroller.userregistration)
router.post("/login",usercontroller.userlogin)
router.post("/send-reset-password-email",usercontroller.senduserpasswordresetemail)
router.post("/reset/:id/:token",usercontroller.resetuserpassword)

//private routes

router.post("/changepassword",usercontroller.changeuserpassword)
router.get("/loggeduser",usercontroller.loggeduser)
export default router;

