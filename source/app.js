import express from "express";
import PhotosRouter from "./routes/photoRouter.js";

const app = express()

app.use(express.json())
app.use(PhotosRouter)

app.get('/',(req,res)=>{
    res.send("Hello World")
})

export default app