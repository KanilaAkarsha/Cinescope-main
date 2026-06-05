import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    let mongodbURL = process.env.MONGODB_URI;
    const projectName = "CinescopeMain";
    console.log(`MONGODB_URL from environment: ${mongodbURL}`);

    if (!mongodbURL) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }

    // Check if the URL already has a database name (simple check for / after host)
    // Most MongoDB URIs look like mongodb+srv://user:pass@host/dbname?options
    // or mongodb://host:port/dbname
    const hasDBName = mongodbURL.replace("mongodb://", "").replace("mongodb+srv://", "").includes("/");

    let url = mongodbURL;
    if (!hasDBName) {
      if (url.endsWith("/")) {
        url = url.slice(0, -1);
      }
      url = `${url}/${projectName}`;
    }

    console.log(`Connecting to MongoDB at ${url}`);
    await mongoose.connect(url);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
