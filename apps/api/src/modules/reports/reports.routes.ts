import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { reportsController } from "./reports.controller.js";

export const reportsRouter = Router();

reportsRouter.use(authMiddleware);
reportsRouter.post("/", reportsController.createReport);
