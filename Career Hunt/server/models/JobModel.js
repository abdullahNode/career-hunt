import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    location: {
      type: String,
      default: "Remote",
    },
    salary: {
      type: Number,
      require: true,
    },
    salaryType: {
      type: String,
      default: "month",
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
    jobType: [
      {
        type: String,
        require: true,
      },
    ],
    description: {
      type: String,
      require: true,
    },
    requirements: {
      type: String,
      require: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    skills: [
      {
        type: String,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const job = mongoose.model("job", jobSchema);

export default job;
