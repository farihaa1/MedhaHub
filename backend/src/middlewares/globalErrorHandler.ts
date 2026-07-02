import app from "../app";
import { Request, Response } from "express";

app.use((error: unknown, req: Request, res: Response) => {
  const err = error as {
    statusCode?: number;
    message?: string;
  };

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Something went wrong",
    error,
  });
});
