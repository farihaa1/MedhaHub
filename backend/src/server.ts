import mongoose from "mongoose";
import app from "./app";
import config from "./config";

async function server() {
  try {
    await mongoose.connect(config.MONGO_URI as string);

    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

server();
