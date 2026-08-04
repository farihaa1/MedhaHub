import type { VercelRequest, VercelResponse } from "@vercel/node";
import mongoose from "mongoose";
import app from "../app";
import config from "../config";

let isConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isConnected) {
    await mongoose.connect(config.mongoUri as string);
    isConnected = true;
  }

  return app(req, res);
}
