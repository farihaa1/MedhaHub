import { UserRole } from "../users/user.constants";
import { Router } from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../utils/validateRequest";
import { AuthValidation } from "./auth.validation";


const AuthRoutes = Router();

AuthRoutes.post(
  "/register",
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.register,
);

AuthRoutes.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login,
);
AuthRoutes.post("/refresh-token", AuthController.refreshToken);
AuthRoutes.post("/logout",auth(UserRole.USER, UserRole.ADMIN), AuthController.logout);
AuthRoutes.post(
  "/change-password",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword,
);

AuthRoutes.get(
  "/me",
  auth(UserRole.USER, UserRole.ADMIN),
  AuthController.getMe,
);

AuthRoutes.patch(
  "/profile",
  auth(UserRole.USER, UserRole.ADMIN),
  AuthController.updateProfile,
);

export default AuthRoutes;
