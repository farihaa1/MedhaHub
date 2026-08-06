
import type { VercelRequest, VercelResponse } from "@vercel/node";
import mongoose from "mongoose";
import app from "../app";
import config from "../config";

let isConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("=== Function Started ===");

  try {
    console.log("Mongo URI exists:", !!config.mongoUri);

    console.log("ReadyState before:", mongoose.connection.readyState);

    if (!isConnected) {
      console.log("Connecting to MongoDB...");
      await mongoose.connect(config.mongoUri);
      console.log("MongoDB Connected");
      isConnected = true;
    }

    console.log("ReadyState after:", mongoose.connection.readyState);

    return app(req, res);
  } catch (err) {
    console.error("FULL ERROR:");
    console.error(err);

    if (err instanceof Error) {
      console.error(err.stack);
    }

    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Unknown",
    });
  }
}