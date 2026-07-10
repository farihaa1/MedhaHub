import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import config from "../config";
import AppError from "../error/AppError";
import { User } from "../modules/users/user.model";

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Read token from cookie
      const token = req.cookies?.accessToken;

      if (!token) {
        throw new AppError(401, "You are not authorized");
      }
      const decoded = jwt.verify(token, config.jwtAccessSecret) as JwtPayload;
      console.log("Decoded:", decoded);
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new AppError(404, "User not found");
      }
      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        throw new AppError(403, "Forbidden");
      }
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
