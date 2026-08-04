import mongoose from "mongoose";
import app from "./app";
import config from "./config";

async function server() {
  try {
    await mongoose.connect(config.mongoUri as string);

  if (config.nodeEnv !== "production") {
    app.listen(config.port, () => {
      console.log("Running");
    });
  }
  } catch (error) {
    console.log(error);
    }
}

server();
