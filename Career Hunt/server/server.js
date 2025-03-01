
import express from "express";
import { auth } from "express-openid-connect";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connect from "./db/connect.js";
import fs from "fs";
import asyncHandler from "express-async-handler";
import User from "./models/UserModel.js";
import mongoose from "mongoose";
import { send } from "process";

dotenv.config();

const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(auth(config));

const ensureUserInDB = asyncHandler(async (user) => {
  try {
    const existingUser = await User.findOne({ auth0Id: user.sub });
    if (!existingUser) {
      const newUser = new User({
        auth0Id: user.sub,
        email: user.email,
        name: user.name,
        role: "jobSeeker",
        profilePicture: user.picture,
      });

      await newUser.save();

      console.log("user added to db", user);
    } else {
      console.log("user is already exist in db", existingUser);
    }
  } catch (error) {
    console.log(" error checking or adding user to db", error.message);
  }
});
app.get("/", async (req, res, next) => {
  if (req.oidc.isAuthenticated()) {
    await ensureUserInDB(req.oidc.user);
    return res.redirect(process.env.CLIENT_URL);
  } else {
    return res.send("logged out");
  }
});

// Import dynamic routes from "./route"
const routeFiles = fs.readdirSync("./route");

routeFiles.forEach((file) => {
  import(`./route/${file}`)
    .then((route) => {
      app.use("/api/v1/", route.default);
    })
    .catch((error) => {
      console.log("Error importing route", error);
    });
});

const server = async () => {
  try {
    await connect();
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Server error", error.message);
    process.exit(1);
  }
};

server();
