import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import eventRoutes from "./routes/event.js";
import socketInit from "./socket/index.js";
import chatRoute from "./routes/chat.js";
import contactRoute from "./routes/contactUs.js";
import adminRoute from "./routes/admin.js";
import courseRoute from "./routes/course.js";
import categoryRoute from "./routes/category.js";
import lessonsRoute from "./routes/lessons.js";
import instructorRoute from "./routes/instructor.js";
import notificationsRoute from "./routes/notifications.js";
import commentsRoute from "./routes/comments.js";
import connectionsRoute from "./routes/connections.js";
import friendRequestRoute from "./routes/friendRequest.js";
import group from "./routes/group.js";
import groupMember from "./routes/groupMember.js";
import groupPost from "./routes/groupPost.js";
import groupComments from "./routes/groupComments.js";
import videos from "./routes/videos.js";
import imageUpload from "./routes/imageUpload.js";
import pdf from "./routes/pdf.js";
// import zoomRoutes from "./routes/zoomRoutes.js";
import zoomRoutes from "./routes/zoomRoutes.js";
const app = express();
dotenv.config();
// app.use(bodyParser.json({ limit: "30mb", extended: true }));
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(express.json({ limit: "30mb", extended: true }));

app.use(cors());
const { server, io } = socketInit(app);

const embedIO = (req, res, next) => {
  req.io = io;
  return next();
};

//setting up routes
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/event", eventRoutes);
app.use("/chat", chatRoute);
app.use("/contactUs", contactRoute);
app.use("/admin", adminRoute);
app.use("/course", courseRoute);
app.use("/category", categoryRoute);
app.use("/lessons", lessonsRoute);
app.use("/instructor", instructorRoute);
app.use("/notifications", embedIO, notificationsRoute);
app.use("/comments", commentsRoute);
app.use("/connections", connectionsRoute);
app.use("/friendRequest", friendRequestRoute);
app.use("/group", group);
app.use("/groupMember", groupMember);
app.use("/groupPost", groupPost);
app.use("/groupComments", groupComments);
app.use("/videos", videos);
app.use("/pdf", pdf);
app.use("/files", imageUpload);
app.use("/zoom", zoomRoutes);

const PORT = process.env.PORT || 8080;

mongoose
  .set("strictQuery", true)
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    server.listen(PORT, function () {
      console.log(`Server is up and running on port ${PORT}`);
    })
  )
  .catch((error) => console.log(error.message));
