import { Router } from "express";
import { UserController } from "./user.controller";

const UserRoutes = Router();

// Get all users
UserRoutes.get("/", UserController.getAllUsers);

// Get single user
UserRoutes.get("/:id", UserController.getSingleUser);

// Update user
UserRoutes.patch("/:id", UserController.updateUser);


export default UserRoutes;
