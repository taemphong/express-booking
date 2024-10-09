import { Router } from "express";
import * as userController from "./user.controller.js";
import { usersValidationRules } from "../Middleware/validation.js";
import { usersupdateValidationRules } from "../Middleware/validation.js";
import { resetPasswordValidationRules } from "../Middleware/validation.js";
const router = Router();

router.get("/getusers", userController.getUsers);
router.get("/getusersid/:id", userController.getUserById);
router.post("/postusers", usersValidationRules(),userController.insertUser);
router.post("/login", userController.loginuser);
router.delete("/deleteusers/:id", userController.deleteUser);
router.patch("/updateusers/:id", usersupdateValidationRules(),userController.updateUserController);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", resetPasswordValidationRules(),userController.resetPassword);
router.get("/getbyuser", userController.getUserByUsername);

export default router;