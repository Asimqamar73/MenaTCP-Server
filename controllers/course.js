import Courses from "../models/courses.js";
import Lessons from "../models/lessons.js";

export const addCourse = async (req, res) => {
  try {
    console.log(req.courseThumbnail,"req.courseThumbnail");
    console.log(req.body,"req.bodyPPPP");
    const {
      instructorId,
      instructorName,
      courseName,
      categoryId,
      courseOverview,
      // courseThumbnail,
    } = req.body;

    const newCourse = await Courses.create({
      instructorName,
      instructorId,
      courseName,
      categoryId,
      courseOverview,
      courseThumbnail:req.courseThumbnail,
      timestamp: Date.now(),
    });
    res.status(200).json(newCourse);
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: error });
  }
};

export const getCourses = async (req, res) => {
  try {
    const { categoryId, userType } = req.query;

    let courses;
    if (userType && userType === "instructor") {
      if (categoryId) {
        courses = await Courses.find({ categoryId, instructorId: req.userId });
      } else {
        courses = await Courses.find({
          instructorId: req.userId,
        });
      }
    } else {
      if (categoryId) {
        courses = await Courses.find({
          categoryId,
        });
      } else {
        courses = await Courses.find();
      }
    }

    res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: error });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Courses.findById(id);
    res.status(200).json(course);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const getCourseByName = async (req, res) => {
  try {
    const { query } = req.params;
    const { categoryId, userType } = req.query;

    let coursesResult;

    if (userType && userType === "instructor") {
      if (categoryId) {
        coursesResult = await Courses.find({
          courseName: { $regex: query, $options: "i" },
          categoryId,
          instructorId: req.userId,
        });
      } else {
        coursesResult = await Courses.find({
          courseName: { $regex: query, $options: "i" },
          instructorId: req.userId,
        });
      }
    } else {
      if (categoryId) {
        coursesResult = await Courses.find({
          courseName: { $regex: query, $options: "i" },
          categoryId,
        });
      } else {
        coursesResult = await Courses.find({
          courseName: { $regex: query, $options: "i" },
        });
      }
    }

    res.status(200).json(coursesResult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const updateCourseById = async (req, res) => {
  try {
    const { courseId: id } = req.params;
    const {
      instructorId,
      courseName,
      categoryId,
      courseOverview,
      courseThumbnail,
    } = req.body;

    const s = await Courses.findByIdAndUpdate(id, {
      // instructorName: instructorName,
      instructorId: instructorId,
      courseName: courseName,
      categoryId: categoryId,
      courseOverview: courseOverview,
      courseThumbnail: courseThumbnail,
    });
    res.status(200).json(s);
  } catch {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong During Updating Course." });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId: id } = req.params;
    const s = await Courses.findByIdAndDelete(id);
    const t = await Lessons.find({ courseId: id });
    for (let i = 0; i < t.length; i++) {
      const response = await Lessons.findByIdAndDelete(t[i]._id);
    }
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
