import Admin from "../models/admin.js";
import Course from "../models/courses.js";
import Instructor from "../models/instructor.js";
import Lesson from "../models/lessons.js";

export const adminAndinstructorAuth = async (req, res, next) => {
  try {

    const admin = await Admin.findById(req.userId);

    if (admin) {
      return next();
    }

    const instructor = await Instructor.findById(req.userId);

    const { courseId, lessonId } = req.params;

    if (!courseId && !lessonId) {
      return next();
    }

    let course;

    if (courseId) {
      course = await Course.findById(courseId);
    } else if (lessonId) {
      let lesson = await Lesson.findById(lessonId);

      course = await Course.findById(lesson.courseId);
    }

    if (instructor && course && instructor._id == course.instructorId) {
      console.log("Admin & Instructor AUTH SY NIKL RHA HY")
      return next();
    }
  } catch (error) {
    console.log("error: ", error);
  }
};
