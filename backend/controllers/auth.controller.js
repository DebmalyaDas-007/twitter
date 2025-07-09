import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {generateTokenAndSetCookie} from "../lib/utils/generateToken.js";
export const signup=async(req,res)=>{
  try {
      const {fullName,username,email,password}=req.body;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(email)){
        return res.status(400).json({error:"Invalid email format"});
      }  
      const existingUser=await User.findOne({username});
      if(existingUser){
        return res.status(400).json({error:"Username already taken"});
      }
      const existingEmail=await User.findOne({email});
      if(existingEmail){
        return res.status(400).json({error:"email already exists"});
      }
      if(password.length<6){
        return res.status(400).json({error:"Password must be at least 6 characters long"});
      }
      const salt=await bcrypt.genSalt(10);
      const hashedPass=await bcrypt.hash(password,salt);

      const newUser=new User({
        fullName:fullName,
        username:username,
        email:email,
        password:hashedPass
      })
      if(newUser){
        generateTokenAndSetCookie(newUser._id,res);
        await newUser.save();
        res.status(201).json({
            _id:newUser._id,
            username:newUser.username,
            fullName:newUser.fullName,
            email:newUser.email,
            followers:newUser.followers,
            following:newUser.following,
            profileImg:newUser.profileImg,
            coverImg:newUser.coverImg
        })
      }
      else{
        res.status(400).json({error:"Invalid user data"})
      }
  } catch (error) {
    console.log("error in signup control",error.message);
    res.status(500).json({error:"Internal server error"});
  }
    
}

export const login=async(req,res)=>{
   try {
    const {username,password}=req.body;
    if(!username || !password){
        return res.status(400).json({error:"Username and password are required"});
    }
    const user=await User.findOne({username});
    const isPasswordCorrect= await bcrypt.compare(password,user?.password || "");
    if(!user || !isPasswordCorrect){
        return res.status(400).json({error:"Invalid username or password"});
    }
    generateTokenAndSetCookie(user._id,res);
    res.status(200).json({
        _id:user._id,
        username:user.username,
        fullName:user.fullName,
        email:user.email,
        followers:user.followers,
        following:user.following, 
        profileImg:user.profileImg,
        coverImg:user.coverImg,
        bio:user.bio,
        link:user.link 
    })
   } catch (error) {
    console.log("error in login control",error.message);
    res.status(500).json({error:"Internal server error"});
   }
    
}

export const logout=async(req,res)=>{
  try {
    res.cookie ('jwt','',{maxAge:0});
    res.status(200).json({message:"Logged out successfully"});
    
  } catch (error) {
    console.log("error in logout control",error.message);
    res.status(500).json({error:"Internal server error"});
    
  }
    
}

export const getMe=async(req,res)=>{
    try {
        const user=await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("error in getMe control",error.message);
        res.status(500).json({error:"Internal server error"});
    }   
}