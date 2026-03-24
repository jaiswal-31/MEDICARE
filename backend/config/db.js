import mongoose from "mongoose";

export const connectDB = async ()=> {
  const dbUrl = process.env.DATABASE_URL || "mongodb://localhost:27017/medicare";
  await mongoose.connect(dbUrl)
  .then(() => {console.log("DB connected")})
  .catch(err => console.error("DB connection error:", err.message));
}