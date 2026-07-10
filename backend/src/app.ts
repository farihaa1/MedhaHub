import express, { Application, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./router/router";
import AppError from "./error/AppError";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Quizzes api",
  });
});


app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  void req;
  void next;

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

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error instanceof Error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

export default app;
