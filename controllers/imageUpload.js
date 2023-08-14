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

export const uploadImage = async (req, res) => {
  try {
    // Process the uploaded image here

    const file = req.file;
    console.log("Received image:", file);

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const uploadedFile = await uploadToGoogleCloudStorage(file);

    res.status(200).json({ uploadedFile });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};
