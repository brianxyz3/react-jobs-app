const mongoose = require("mongoose");
const User = require("./user");
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
  postedBy: {
    type: String,
    // required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  jobApplicants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

JobSchema.post("findOneAndDelete", async (job) => {
  console.log(job);
  
  console.log("hit delete post middleware")
  if(job) {
    job.jobApplicants.map( async (applicant) => {
      const user = await User.findByIdAndUpdate({_id: applicant},
        { $pull: { pendingJobApplications: job._id } }
      );
      console.log(user);
      return;
    })
    // await User.updateMany(
    //   {
    //     _id: {
    //       $in: job.jobApplicants,
    //     },
    //   },
    //   { $pull: { pendingJobApplications: job._id } }
    // ).catch((err) => console.log(err));
  }
})

module.exports = mongoose.model("Job", JobSchema);
