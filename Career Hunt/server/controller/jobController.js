import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import Job from "../models/JobModel.js";

export const createJob = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ auth0Id: req.oidc.user.sub });
    const isAuth = req.oidc.isAuthenticated() || user.email;

    if (!isAuth) {
      return res.status(401).json({ message: "not authenticated" });
    }

    const {
      title,
      description,
      location,
      salary,
      jobType,
      tags,
      skills,
      salaryType,
      negotiable,
    } = req.body;
    if (
      !title ||
      !description ||
      !location ||
      !salary ||
      !jobType ||
      !tags ||
      !skills ||
      !salaryType
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const job = new Job({
      title,
      description,
      location,
      salary,
      jobType,
      tags,
      skills,
      salaryType,
      negotiable,
      createdBy: user._id,
    });
    await job.save();

    return res.status(201).json(job);
  } catch (error) {
    console.log("error in create job: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

export const getJob = asyncHandler(async (req, res, next) => {
  try {
    const jobs = await Job.find({})
      .populate("createdBy", "name email profilePicture")
      .sort({ createdAt: -1 });

    console.log("jobs:", jobs);
    return res.status(200).json(jobs);
  } catch (error) {
    console.log("error in getting job:", error);
    return res.status(500).json({
      message: "server error",
    });
  }
});

export const getJobByUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const jobs = await Job.find({ createdBy: user._id }).populate(
      "createdBy",
      "name profilePicture"
    );
    return res.status(200).json(jobs);
  } catch (error) {
    console.log("error in getJobByUser:", error);
    return res.status(500).json({
      message: "server error ",
    });
  }
});

export const searchJobs = asyncHandler(async (req, res, next) => {
  try {
    const { tags, location, title } = req.query;

    let query = {};
    if (tags) {
      query.tags = { $in: tags.split(",") };
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    const jobs = await Job.find(query).populate(
      "createdBy",
      "name profilePicture"
    );
    return res.status(200).json(jobs);
  } catch (error) {
    console.log("error in searchJobs :", error);
    return res.status(500).json({ message: "server error" });
  }
});
export const applyJob = asyncHandler(async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "job not found" });
    }

    const user = await User.findOne({ auth0Id: req.oidc.user.sub });

    if (!user) {
      return res.status(404).json({ message: "user is not found" });
    }

    if (job.applicants.includes(user._id)) {
      return res.status(400).json({ message: "already applied for this job" });
    }
    job.applicants.push(user._id);
    await job.save();
    return res.status(200).json(job);
  } catch (error) {
    console.log("error in applyJob :", error);
    return res.status(500).json({
      message: "server error",
    });
  }
});

export const likeJob = asyncHandler(async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "job not found" });
    }
    const user = await User.findOne({ auth0Id: req.oidc.user.sub });

    if (!user) {
      return res.status(404).json({ message: "user is not found" });
    }

    const isLiked = job.likes.includes(user._id);

    if (isLiked) {
      job.likes = job.likes.filter((like) => !like.equals(user._id));
    } else {
      job.likes.push(user._id);
    }

    await job.save();

    return res.status(200).json(job);
  } catch (error) {
    console.log("error in like a job", error);
    return res.status(500).json({ message: "server error" });
  }
});

export const getJobById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate(
      "createdBy",
      "name profilePicture"
    );

    if (!job) {
      return res.status(404).json({ message: "job not found" });
    }

    return res.status(200).json(job);
  } catch (error) {
    console.log("error in get getJobById :", error);
    return res.status(500).json({
      message: "server error",
    });
  }
});
export const deleteJob = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    const user = await User.findOne({ auth0Id: req.oidc.user.sub });
    if (!job) {
      return res.status(404).json({ message: " job not found" });
    }
    if (!user) {
      return res.status(404).json({ message: " user not found" });
    }
    await job.deleteOne({
      _id: id,
    });
    return res.status(200).json({ message: "job deletes successfully" });
  } catch (error) {
    console.log("error in deleteJob", error);
    return res.status(500).json({ message: "server error" });
  }
});
