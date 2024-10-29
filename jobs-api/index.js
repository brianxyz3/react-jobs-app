// require("dotenv").config();
import express from "express";
import mongoose from "mongoose";
import Job from "./model/job.js";

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/react-jobs";

const PORT = process.env.Port || 5000;

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/jobs", async (req, res) => {
  const jobs = await Job.find();
  res.status(200).json(jobs);
});

app.post("/jobs", async (req, res) => {
  const newJob = new Job(req.body);
  await newJob.save();
  res.status(200).json(newJob);
});

app.get("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  res.status(200).json(job);
});

app.put("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  const job = await Job.findByIdAndUpdate(id, req.body);
  res.status(200).json(job);
});

app.delete("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  const job = await Job.findByIdAndDelete(id);
  res.status(200).json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
