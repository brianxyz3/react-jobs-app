import mongoose from "mongoose";
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  id: String,
  type: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Remote", "Internship"],
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    enum: [
      "Undisclosed",
      "Under $50K",
      "$50K - 60K",
      "$60K - 70K",
      "$70K - 80K",
      "$80K - 90K",
      "$90K - 100K",
      "$100K - 125K",
      "$125K - 150K",
      "$150K - 175K",
      "$175K - 200K",
      "Over $200K",
    ],
  },
  company: {
    name: {
      type: String,
      required: true,
    },
    description: String,
  },
  contact: {
    email: {
      type: String,
      required: true,
    },
    phone: String,
  },
});

export default mongoose.model("Job", JobSchema);
