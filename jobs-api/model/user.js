import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import Job from "./job.js";
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
  jobListings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
});
UserSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", UserSchema);
