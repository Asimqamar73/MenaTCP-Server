import { Storage } from "@google-cloud/storage";
import gcp from "../utils/gcp.js";

const storage = new Storage({
  projectId: gcp.project_id,
  credentials: {
    client_email: gcp.client_email,
    private_key: gcp.private_key,
  },
});

const uploadToGoogleCloudStorage = (file) => {
  const bucketName = "menatcp";
    console.log("file ::::::::::",file)
  return new Promise((resolve, reject) => {
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      reject(error);
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

export const videoUpload = async (req, res, next) => {
  try {
    // Process the uploaded image here
    console.log("Video upload me agya hy")
    const videoSRC = req.files[0];
    const videoThumbnail = req.files[1];


    console.log("videoSRC ::::",videoSRC,videoThumbnail);
    if (!videoSRC || !videoThumbnail  ) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const video_GCP_SRC = await uploadToGoogleCloudStorage(videoSRC);
    const video_GCP_Thumbnail = await uploadToGoogleCloudStorage(videoThumbnail);
      
    req.video_GCP_SRC=video_GCP_SRC,
    req.video_GCP_Thumbnail=video_GCP_Thumbnail,
    next();
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};
