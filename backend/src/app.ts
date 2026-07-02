import express, { Application, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./router/router";

const app: Application = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Quizzes api",
  });
});

app.use((error: unknown, req: Request, res: Response, _next: NextFunction) => {
  void _next;

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: {
        name: error.name,
        errors: error.errors,
      },
    });
  }

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

export default app;
