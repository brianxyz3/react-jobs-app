const mongoose = require("mongoose");
const Job = require("./job.js");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  jobListings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  pendingJobApplications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
});

UserSchema.post("findOneAndDelete", async (user) => {
  if (user) {
    await Job.deleteMany({
      _id: {
        $in: user.jobListings,
      },
    });
  }
});

module.exports = mongoose.model("User", UserSchema);
