import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import connectdb from "./config/connectdb.js";
import userroutes from './routes/userroutes.js';

dotenv.config();
const app = express();
const PORT=process.env.PORT
const DATABASE_URL=process.env.DATABASE_URL
const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY
app.use(express.json());
app.use(cors());
connectdb(DATABASE_URL);

app.use("/api/user/",userroutes)



app.get("/",(req,res)=>{
  res.send("Hello World");
})

app.listen(PORT,()=>{
  console.log(`Server is running on port http://localhost:${PORT} \n \n http://localhost:${PORT}/api/user/register`);
})