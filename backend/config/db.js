import mongoose from "mongoose";

export const connectDb = async () => {
  const { setServers } = await import("node:dns");
  // The local DNS resolver rejects MongoDB Atlas SRV lookups on this network.
  setServers(["1.1.1.1", "8.8.8.8"]);
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("MongoDB connected");
};
