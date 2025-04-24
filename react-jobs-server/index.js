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

const defaultExpTime = 60 * 30  ;
let jobId;

const sessionConfig = {
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24,
    maxAge: 1000 * 60 * 60 * 24,
  },
};

app.use(session(sessionConfig));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
  "/job-application/:userId",
  isLoggedIn,
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
      if (userId) {
        const existingUser = await User.findOne({ userId });
        if (existingUser) return res.status(200).json({message: "Welcome Back!"});
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
        res
          .status(200)
          .json({ message: "User Successfully Registered, Welcome!" });
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
      console.log(req.body);
      
      const { userId } = req.body;
      if (userId) {
        const existingUser = await User.findOne({ userId });
        console.log(existingUser);
        
        if (existingUser) return res.status(200).json({success: "true"});
        
        res.status(401).json({success: "false", message: "Unknown User"});
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
    user[0].jobListings.push(newJob._id);
    await user[0].save().catch((e) => console.log(e));
    const allJobs = await redisClient.get("jobs:undefined")
      .then(async data => {
        if(data == null) {
          await redisClient.setEx(`jobs:${newJob._id}`, defaultExpTime, JSON.stringify(newJob))
          return res.status(201).json(newJob);
        }
        const cacheData = JSON.parse(data)
        cacheData.push(newJob);
        return cacheData;
      }, err => console.log("Redis Error " + err));

    await redisClient
      .multi()
      .setEx(`jobs:${newJob._id}`, defaultExpTime, JSON.stringify(newJob))
      .setEx("jobs:undefined", defaultExpTime, JSON.stringify(allJobs))
      .exec()
    
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
        const jobData = await Job.findById(id).populate("jobApplicants");
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
    const job = await Job.findById(id);
    if(job.jobApplicants.includes(user[0]._id)) return res
      .status(200)
      .json({ message: "User Already Applied", success: "true" });;

    job.jobApplicants.push(user[0]._id);
    user[0].pendingJobApplications.push(job._id);
    await user[0].save().catch((err) => console.log(err));
    await job.save().catch((err) => console.log(err));
    await job.populate("jobApplicants");
    await user[0].populate("pendingJobApplications");
    await redisClient
      .multi()
      .setEx(
        `userJobHistory:${user[0].userId}`,
        defaultExpTime,
        JSON.stringify(user[0].pendingJobApplications)
      )
      .setEx(`jobs:${job._id}`, defaultExpTime, JSON.stringify(job))
      .exec()
      .then(
        async (result) => {
          const isFailed = result.some((response) =>
            response.toLowerCase().includes("error")
          );
          if (isFailed) {
            await redisClient.del([
              `userJobHistory:${user[0].userId}`,
              `jobs:${job._id}`,
            ]);
          }
          return console.log(result);
        },
        (err) => {
          return console.log("Redis Error " + err);
        }
      );
    console.log("In Job Apply");
    if (!job) throw new ExpressError(404, "Job Not Found");
    res.status(200).json({ message: "Successfully Applied to Job, Your CV Has Been Sent TO The Recruitement Team", success: "true" });
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
    const newJob = {...updatedJob}
    const updatedJobBody = {...newJob._doc, ...req.body}
    
    // Update Redis job Cache
    const cachedJobs = await redisClient.get("jobs:undefined");
    if(cachedJobs == null) {
      await redisClient.del(`jobs:${updatedJob._id}`,);
      return res.status(200).json(updatedJob);
    }
    const allJobs = JSON.parse(cachedJobs);

    const allJobsUpdated = allJobs.map(job => (      
      job._id == updatedJobBody._id ? updatedJobBody : job
    ));

    await redisClient
      .multi()
      .setEx(
        `jobs:${updatedJob._id}`,
        defaultExpTime,
        JSON.stringify(updatedJobBody)
      )
      .setEx("jobs:undefined", defaultExpTime, JSON.stringify(allJobsUpdated))
      .exec()
      .then(
        async (result) => {
          console.log(result);
          const isFailed = result.some((response) => response.toLowerCase().includes("error"))
          if (isFailed) {
            await redisClient.del(["jobs:undefined", `jobs:${updatedJob._id}`]);
          }
          return;
        },
        (err) => {
          return console.log("Redis Error " + err);
        }
      );      
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
    await User.findByIdAndUpdate(deletedJob.author, {
      $pull: { jobListings: deletedJob._id },
    });

    // Get Cache Data
    const allJobsCache = await redisClient.get("jobs:undefined");
    if (allJobsCache == null) {
      await redisClient.del(`jobs:${deletedJob._id}`);
      return res.status(200).json({ message: "Job deleted successfully" });
    }
    const allJobs = JSON.parse(allJobsCache);
    const updatedAllJobs = allJobs.filter((job) => job._id != deletedJob._id);
    if (!deletedJob) throw new ExpressError(404, "Job Not Found");
    
    // Update Redis job Cache
    await redisClient
      .multi()
      .del(`jobs:${deletedJob._id}`)
      .setEx("jobs:undefined", defaultExpTime, JSON.stringify(updatedAllJobs))
      .exec()
      .then(
        async (result) => {
          console.log(result);
          if (result == null) {
            await redisClient.del(["jobs:undefined", `jobs:${updatedJob._id}`]);
          }
          return;
        },
        (err) => {
          return console.log("Redis Error " + err);
        }
      );

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
      redisClient.setEx(key, defaultExpTime, JSON.stringify(freshData));
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