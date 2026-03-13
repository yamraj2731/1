import app from './source/app.js'
import dotenv from 'dotenv'
import connectDb from './source/config/connectDb.js'
import { connectTelegram } from './source/config/telegram.js';
dotenv.config()
connectDb()
connectTelegram()
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})