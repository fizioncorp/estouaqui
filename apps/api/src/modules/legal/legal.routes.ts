import { Router } from "express";
import { legalController } from "./legal.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

export const legalRouter = Router();

legalRouter.get("/terms", legalController.terms);
legalRouter.get("/privacy", legalController.privacy);
legalRouter.get("/volunteer-terms", legalController.volunteerTerms);
legalRouter.post("/accept", authMiddleware, legalController.accept);
