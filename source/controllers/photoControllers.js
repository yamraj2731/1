import { exiftool } from "exiftool-vendored";
import { client } from "../config/telegram.js";
import photoModel from "../models/photoModel.js";

const channelId = -1003583495783; // replace with your channel ID

export const uploadPhotos = async (req, res) => {
    try {
        const uploadPhotos = []

        for (let photo of req.files) {
            const tags = await exiftool.read(photo.path);
            const result = await client.sendFile(channelId, {
                file: photo.path,
                fileName: photo.originalname,
                mimeType: photo.mimetype,
                forceDocument: false
            });
            const photoData = await photoModel.create({
                id: result.id,
                photoName: photo.originalname,
                photoDevice: tags.Make || "",
                photoModel: tags.Model || "",
                photoSoftware: tags.Software || "",
                photoExposureTime: tags.ExposureTime || "",
                photoFocal: tags.FocalLength || "",
                photoIso: tags.ISO || "",
                photoLatitude: tags.GPSLatitude || "",
                photoLongitude: tags.GPSLongitude || "",
                photoZone: tags.Zone || "",
                photoMegapixels: tags.Megapixels || "",
                photoSize: tags.FileSize || "",
                photoDate: {
                    year: tags.DateTimeOriginal.year,
                    month: tags.DateTimeOriginal.month,
                    day: tags.DateTimeOriginal.day,
                    hour: tags.DateTimeOriginal.hour,
                    minute: tags.DateTimeOriginal.minute,
                    second: tags.DateTimeOriginal.second
                },
            });
            uploadPhotos.push(photoData);
        }
        res.status(200).json({ message: "Photos uploaded successfully", data: uploadPhotos })

    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "Error uploading photos", error: error.message })
    }
}

export const getPhotos = async (req, res) => {
    try {
        const photos = await photoModel.find();
        res.status(200).json({ message: "Photos retrieved successfully", data: photos })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving photos", error: error.message })
    }
}

export const downloadPhoto = async (req, res) => {
    try {
        const fileMeta = await photoModel.findById(req.params.id);
        if (!fileMeta) return res.status(404).json({ error: "File not found" });

 // get telegram message
        const message = await client.getMessages(channelId, {
            ids: [Number(fileMeta.id)]
        });
        
        if (!message || !message[0]) {
            return res.status(404).json({ error: "Telegram message not found" });
        }

        // download file from telegram
        const buffer = await client.downloadMedia(message[0]);

        if (!buffer) {
            return res.status(500).json({ error: "Download failed" });
        }

        // headers for download
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileMeta.photoName}"`
        );

        res.setHeader("Content-Type", fileMeta.mimeType || "application/octet-stream");

        res.send(buffer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error downloading photo", error: error.message })
    }
}