import mongoose from "mongoose";
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
});

export default mongoose.model("User", UserSchema);
