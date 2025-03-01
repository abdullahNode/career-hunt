import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("connected to db");
  } catch (error) {
    console.log("db is failed to connect", error.message);
    process.exit(1);
  }
};
export default connect;
