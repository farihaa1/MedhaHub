import type { VercelRequest, VercelResponse } from "@vercel/node";
import mongoose from "mongoose";
import app from "../app";
import config from "../config";

let isConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!isConnected) {
      await mongoose.connect(config.mongoUri as string);
      isConnected = true;
    }

    return app(req, res);
  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server crashed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
