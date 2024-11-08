import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import localStrategy from "passport-local";
import jwt from "jsonwebtoken";
import Job from "./model/job.js";
import User from "./model/user.js";
import ExpressError from "./utilities/ExpressError.js";
import catchAsync from "./utilities/catchAsync.js";
import { sanitizeJob, isLoggedIn, isAuthor } from "./middleware.js";
import validator from "validator";

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
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const {
        username,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      } = req.body;
      if (validator.equals(password, confirmPassword)) {
        const user = new User({ username, email, firstName, lastName });
        const registeredUser = await User.register(user, password);
        if (!registeredUser) {
          throw new ExpressError(500, "Something Went Wrong");
        }
        req.login(registeredUser, (err) => {
          if (err) return next(err);
          const token = jwt.sign({ id: registeredUser._id }, "userToken", {
            expiresIn: "1h",
          });
          res.status(200).json({ token, id: registeredUser._id });
        });
      }
    } catch (err) {
      console.log("Backend err " + err);
    }
  })
);

app.post(
  "/login",
  passport.authenticate("local"),
  catchAsync(async (req, res) => {
    console.log("GOT HERE");
    const { username } = req.body;
    const user = await User.findByUsername(username);
    console.log(user);
    const token = jwt.sign({ id: user._id }, "userToken", {
      expiresIn: "1h",
    });
    res.status(200).json({ token, id: user._id });
  })
);

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
    const newJob = new Job(req.body);
    if (!newJob) throw ExpressError(400, "Invalid Job Data Input(s)");
    await newJob.save();
    const user = await User.findById(newJob.author);
    user.jobListings.push(newJob._id);
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
  "/jobs/:id",
  sanitizeJob,
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
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) throw new ExpressError(404, "Job Not Found");
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
