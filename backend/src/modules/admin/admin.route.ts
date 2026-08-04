import { Router } from "express";
import { UserRole } from "../users/user.constants";
import auth from "../../middlewares/auth";
import { AdminController } from "./admin.controller";

const AdminDashboardRoutes = Router();

AdminDashboardRoutes.get(
  "/dashboard",
  auth(UserRole.ADMIN),
  AdminController.getDashboard,
);

export default AdminDashboardRoutes ;