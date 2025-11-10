import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
    await mongoose.connect(process.env.MONGODB_URl);
    console.log("MONGODB CONNECTED");
    }catch(err){
        console.log(err);
    }

}

export default connectDB