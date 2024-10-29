import mongoose from "mongoose";
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  id: String,
  type: String,
  title: String,
  description: String,
  location: String,
  salary: String,
  company: {
    name: String,
    description: String,
    contactEmail: String,
    contactPhone: String,
  },
});

export default mongoose.model("Job", JobSchema);
