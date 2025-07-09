import express from "express"
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes.js'
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
const app=express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/auth",authRoutes);

dotenv.config();
const PORT=process.env.PORT||7000;
app.get('/',(req,res)=>{
    res.send("server is ready");
})

app.listen(PORT,()=>{
    console.log('server is running on PORT:',PORT);
    connectMongoDB();
})