import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import Job from "./model/job.js";
import User from "./model/user.js";
import ExpressError from "./utilities/ExpressError.js";
import catchAsync from "./utilities/catchAsync.js";
import {
  sanitizeJob,
  isLoggedIn,
  isAuthor,
  sanitizeUser,
} from "./middleware.js";

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/react-jobs";
const secret = process.env.HIDDEN || "somethingonlythedevsknow";
const PORT = process.env.PORT || 5000;

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
const sessionConfig = {
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 5,
    maxAge: 1000 * 60 * 60 * 24 * 5,
  },
};

app.use(session(sessionConfig));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
  "/user/:id",
  catchAsync(async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.find({ userId: id });
      const userDetail = await user[0].populate("pendingJobApplications");
      res.status(200).json(userDetail);
    } catch (err) {
      console.log(err);
    }
  })
);

app.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { firstName, lastName, email, userId } = req.body;
      if (email) {
        const oldUser = await User.findOne({ email });
        if (oldUser) return res.status(200).json(null);
        const newUser = new User({
          email,
          firstName,
          lastName,
          userId,
        });
        const registeredUser = await newUser.save();
        console.log(registeredUser);

        if (!registeredUser)
          throw new ExpressError(500, "Something Went Wrong Registering User");
        res.status(200).json({ id: registeredUser._id });
      }
    } catch (err) {
      console.log("Backend error " + err);
    }
  })
);

app.delete("/delete-user", isLoggedIn, async (req, res) => {
  const { userId } = req.body;
  await User.findOneAndDelete({ userId });
  res.status(200).json();
});

app.get(
  "/jobs",
  catchAsync(async (req, res) => {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  })
);

app.post(
  "/jobs",
  sanitizeJob,
  isLoggedIn,
  catchAsync(async (req, res) => {
    if (!req.body) throw new ExpressError(400, "Invalid Job Data");
    const currentUser = req.body.postedBy;

    const user = await User.find({ userId: currentUser });

    const newJob = new Job({
      ...req.body,
      author: user[0]._id,
    });

    if (!newJob) throw ExpressError(400, "Invalid Job Data Input(s)");

    await newJob.save().catch((e) => console.log(e));
    user[0].jobListings.push(newJob._id);
    await user[0].save();
    res.status(201).json(newJob);
  })
);

app.get(
  "/jobs/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) throw new ExpressError(404, "Job Not Found");
    res.status(200).json(job);
  })
);

app.put(
  "/job-apply/:id",
  sanitizeUser,
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const currentUser = req.body.currentUser;
    const user = await User.find({ userId: currentUser });
    console.log(user);
    const updatedJob = await Job.findById(id);
    updatedJob.jobApplicants.push(user[0]._id);
    console.log(updatedJob);
    user[0].pendingJobApplications.push(updatedJob._id);
    console.log(user);
    await user[0].save().catch((err) => console.log(err));
    await updatedJob.save().catch((err) => console.log(err));

    console.log("In Job Apply");
    if (!updatedJob) throw new ExpressError(404, "Job Not Found");
    res.status(200).json();
  })
);

app.put(
  "/jobs/:id",
  sanitizeJob,
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(id, req.body);
    if (!updatedJob) throw new ExpressError(404, "Job Not Found");
    res.status(200).json(updatedJob);
  })
);

app.delete(
  "/jobs/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) throw new ExpressError(404, "Job Not Found");
    const updateUser = await User.findByIdAndUpdate(deletedJob.author, {
      $pull: { jobListings: deletedJob._id },
    });

    res.status(200).json({ message: "Job deleted successfully" });
  })
);

app.all("*", (req, res, next) => {
  throw new ExpressError(404, "Page Not Found");
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong. Try Again" } = err;
  res.status(statusCode).json(`${statusCode} ${message}`);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
