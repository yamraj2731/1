import express from "express";
import uploadMulter from '../config/multer.js'
import { uploadPhotos,getPhotos, downloadPhoto } from "../controllers/photoControllers.js";

const PhotosRouter = express.Router()

// upload photos 

PhotosRouter.post('/upload',uploadMulter.array('photos',50),uploadPhotos)
PhotosRouter.get('/',getPhotos)
PhotosRouter.get('/download/:id',downloadPhoto)

export default PhotosRouter