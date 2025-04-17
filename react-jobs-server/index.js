// const dotenv = require("dotenv");

// if (process.env.NODE_ENV !== "production") {
//   dotenv.config();
// }
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const Job = require("./model/job.js");
const User = require("./model/user.js");
const ExpressError = require("./utilities/ExpressError.js");
const catchAsync = require("./utilities/catchAsync.js");
const {
  sanitizeJob,
  isLoggedIn,
  isAuthor,
  sanitizeUser,
} = require("./middleware.js");

const app = express();
const redisClient = redis.createClient();

( async function startRedis() {
  console.log("Ran IIFE");

  redisClient.on("error", err => console.log("Redis Client Error", err))
  redisClient.on("ready", () => {
    console.log("Redis client has started");
  })
  .connect();
  redisClient.ping();
}
)();




const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/react-jobs";
const secret = process.env.HIDDEN || "somethingonlythedevsknow";
const PORT = process.env.PORT || 5000;

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const deafaultExpTime = 1000 * 60 * 60 ;
let jobId;

const sessionConfig = {
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + deafaultExpTime * 5,
    maxAge: deafaultExpTime * 5,
  },
};

app.use(session(sessionConfig));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
  "/job-application/:userId",
  catchAsync(async (req, res) => {
    try {
      const { userId } = req.params;
      const userJobApplicationHistory = await getOrSetCache(`userJobHistory:${userId}`, async () => {
        const user = await User.find({ userId });
        const userDetail = await user[0].populate("pendingJobApplications");
        return userDetail.pendingJobApplications;
      });
      res.status(200).json(userJobApplicationHistory);
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

app.post(
  "/login",
  catchAsync(async (req, res) => {
    try {
      const { email } = req.body;
      if (email) {
        const oldUser = await User.findOne({ email });
        if (oldUser) return res.status(200).json(null);
        
        res.status(401).json({message: "Unknown User"});
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
    jobId = undefined;

    const jobs = await getOrSetCache(`jobs:${jobId}`, 
      async () => {
        const allJobs = await Job.find()
        return allJobs;
    })
    res.status(200).json(jobs);
  })
);

app.post(
  "/jobs",
  sanitizeJob,
  isLoggedIn,
  catchAsync(async (req, res) => {
    try{
    if (!req.body) throw new ExpressError(400, "Invalid Job Data");
    const currentUser = req.body.postedBy;

    const user = await User.find({userId: currentUser});
 
    const newJob = new Job({
      ...req.body,
      author: user[0]._id,
    });

    if (!newJob) throw ExpressError(400, "Invalid Job Data Input(s)");
    console.log(newJob);
    
    await newJob.save().catch((e) => console.log(e));
    await getOrSetCache(`jobs:${newJob._id}`, () => newJob);
    await redisClient.del("jobs:undefined");
    user[0].jobListings.push(newJob._id);
    await user[0].save();
    res.status(201).json(newJob);
    } catch (err) {
      console.log(err);
    }
  })
);

app.get(
  "/jobs/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    jobId = id;
    const job = await getOrSetCache(`jobs:${jobId}`, 
      async () => {
        const jobData = await Job.findById(id);
        if (!jobData) throw new ExpressError(404, "Job Not Found");
        return jobData;
      }
    )
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
    const job = await Job.findById(id);
    job.jobApplicants.push(user[0]._id);
    console.log(job);
    user[0].pendingJobApplications.push(job._id);
    console.log(user);
    await user[0].save().catch((err) => console.log(err));
    await job.save().catch((err) => console.log(err));
    await redisClient.del(`userJobHistory:${user[0].userId}`);
    console.log("In Job Apply");
    if (!job) throw new ExpressError(404, "Job Not Found");
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
    await redisClient.del([`jobs:${deletedJob._id}`, "jobs:undefined"]);
    await User.findByIdAndUpdate(deletedJob.author, {
      $pull: { jobListings: deletedJob._id },
    });  

    res.status(200).json({ message: "Job deleted successfully" });
  })
);

// app.all("*", (req, res, next) => {
//   throw new ExpressError(404, "Page Not Found");
// });

function getOrSetCache (key, cbFunc) {
  return new Promise((resolve, reject) => {
    redisClient.get(key)
    .then(async (data) => {
      if(data != null) return resolve(JSON.parse(data));
      const freshData = await cbFunc();      
      redisClient.setEx(key, deafaultExpTime, JSON.stringify(freshData));
      resolve(freshData)
    }).catch(error => {
      if(error) return reject(error)
    })
  })
}

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong. Try Again" } = err;
  res.status(statusCode).json(`${statusCode} ${message}`);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
