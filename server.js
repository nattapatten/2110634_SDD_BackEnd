const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const auth = require("./routes/auth");

const auth = require("./routes/auth");
const assignment = require("./routes/assignments");
// const course=require('./routes/course');
const courses = require("./routes/courses");
const student = require("./routes/student");
const notification = require("./routes/notification");
const advisor = require("./routes/advisor");
const AssignmentCourse = require("./routes/assignmentCourse");
const selectPath = require("./routes/selectPath");

app.use("/api/v1/auth", auth);
app.use("/api/v1/assignments", assignment);
app.use("/api/v1/selectPath", selectPath);
app.use("/api/v1/assignmentCourse", AssignmentCourse);
app.use("/api/v1/courses", courses);
app.use("/api/v1/student", student);
app.use("/api/v1/advisor", advisor);
app.use("/api/v1/notifications", notification);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log("Server running in", process.env.NODE_ENV, " mode on port ", PORT)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
