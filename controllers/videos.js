import Videos from "../models/videos.js";



export const addVideosInLessonById = async (req, res) => {
    try {
      console.log("POTTTTTTTTTT");
      const { lessonId: id } = req.params;
      const {videoName} = req.body;
      const videoSrcThumbnail = req.video_GCP_Thumbnail;
      const videoSrcFile = req.video_GCP_SRC;
  
      if (videoName && videoSrcFile) {
        const s = await Videos.create({
          lessonId:id,
          videoName: videoName,
          videoSrc: videoSrcFile,
          videoThumbnailSrc: videoSrcThumbnail,
          source:"file",
        });
      } 
      res.status(200).json({ message: "Video Added Successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong." });
    }
  };

  export const addVideosInLessonByURL = async (req, res) => {
    try {
      const { lessonId: id } = req.params;
      const {videoName,videoUrl } = req.body;
      const videoSrcThumbnail = req.uploadedFile;
      const videoSrcFile = videoUrl;
      if (videoName && videoSrcFile) {
        const s = await Videos.create({
          lessonId:id,
          videoName: videoName,
          videoSrc: videoSrcFile,
          videoThumbnailSrc: videoSrcThumbnail,
          source:"URL",
        });
        console.log("s",s);
      } 
      res.status(200).json({ message: "Video Added Successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong." });
    }
  };

export const getVideosByLessonId = async (req, res) => {
    try {
      const  lessonId  = req.params;
      const videos = await Videos.find(lessonId);
      res.status(200).json(videos);
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  }; 

  export const deleteVideoInLessonById = async (req,res)=>{
    try{
      const {videoId}= req.params;
      const response = await Videos.findByIdAndDelete(videoId);
      res.status(200).json("Video Deleted Successfully");
    }catch(e){
      res.status(500).json(e);
      console.log(e);
    }
  }