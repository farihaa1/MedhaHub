class AppError extends Error {
  public statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode || 500;
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
