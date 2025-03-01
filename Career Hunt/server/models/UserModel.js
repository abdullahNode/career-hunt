import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,  // ✅ Correct
        required: true,
      },
      email: {
        type: String,  // ✅ Correct
        required: true,
        unique: true,
      },
      auth0Id: {
        type: String,  // ✅ Correct
        required: true,
        unique: true,
      },
      appliedJobs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "job",
        },
      ],
      savedJobs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "job",
        },
      ],
      role: {
        type: String,
        enum: ["jobSeeker", "recruiter"],
        default: "jobSeeker",
      },
      resume: {
        type: String,
      },
      profilePicture: {
        type: String,
      },
      bio: {
        type: String,
        default: "no bio yet",
      },
      profession: {
        type: String,
        default: "Unemployed",
      },
    },
    { timestamps: true }  // ✅ Fixed typo from `timeseries` to `timestamps`
  );
  
const User = mongoose.model("User", userSchema);

export default User;
