import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const response = await mongoose.connect('mongodb+srv://ojhawhatapp_db_user:yamraj2731@cluster0.d5xkqji.mongodb.net/?appName=Cluster0');
        console.log("CONNECTED TO THE DATABASE SUCCESSFULLY");
    } catch (error) {
        console.log("INTERNAL SERVER ERROR WHILE CONNECTING TO THE DATABASE");
        console.log(error);
    }
}

export default connectDb