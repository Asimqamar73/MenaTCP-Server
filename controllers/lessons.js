import Lessons from "../models/lessons.js";

export const addLessons = async (req, res) => {
  try {
    const {
      lessonNumber,
      lessonName,
      lessonDescription,
      courseId,
      pdfName,
      pdfFile,
      videoName,
    } = req.body;

    let alreadyExisting = await Lessons.findOne({ lessonNumber, courseId });

    if (alreadyExisting)
      return res
        .status(400)
        .json({ message: "Lesson with this number already exists" });

    const newLesson = await Lessons.create({
      lessonNumber,
      lessonName,
      lessonDescription,
      courseId,
      pdfName,
      pdfFile,
      videoName,
      timestamp: Date.now(),
    });

    res.status(200).json(newLesson);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const getAllLessonsByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;

    const lessons = await Lessons.find({ courseId });

    res.status(200).json(lessons);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lessons.findById(id);

    res.status(200).json(lesson);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const updateVideoInLessonById = async (req, res) => {
  const { lessonId: id } = req.params;
  const videoArray = req.body;
  const s = await Lessons.findByIdAndUpdate(id, { videos: videoArray });
  res.status(200).json(s);
};
export const updatePdfInLessonById = async (req, res) => {
  const { lessonId: id } = req.params;
  const pdfArray = req.body;
  const s = await Lessons.findByIdAndUpdate(id, { pdfs: pdfArray });
  res.status(200).json(s);
};
export const updateLessonById = async (req, res) => {
  const { lessonId: id } = req.params;
  const { lessonNumber, lessonName, lessonDescription } = req.body;
  const s = await Lessons.findByIdAndUpdate(
    id,
    {
      lessonName,
      lessonDescription,
    },
    { new: true }
  );
  res.status(200).json(s);
};
export const deleteLessonById = async (req, res) => {
  try {
    const { lessonId: id } = req.params;
    const deleteResponse = await Lessons.findByIdAndDelete(id);

    res.status(200).json(deleteResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
