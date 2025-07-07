import mongoose from "mongoose";

const connectMongoDB=async()=>{
    try {
        const connectionInstance=await mongoose.connect(process.env.MONGO_URI);
        console.log('MONGODB Connected:',connectionInstance.connection.host);
        
    } catch (error) {
        console.log("MongoDB connection error:",error);
        process.exit(1);
    }
}

export default connectMongoDB