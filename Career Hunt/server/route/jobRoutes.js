import express from "express";
import {
  applyJob,
  createJob,
  getJob,
  getJobById,
  getJobByUser,
  likeJob,
  searchJobs,
  deleteJob,
} from "../controller/jobController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/job",  createJob);
router.get("/job", getJob);
router.get("/job/user/:id", protect, getJobByUser);
router.get("/job/search", searchJobs);
router.put("/job/apply/:id", protect, applyJob);
router.put("/job/like/:id", protect, likeJob);
router.get("/job/:id" ,protect , getJobById)
router.delete("/job/:id", protect , deleteJob)
export default router;
