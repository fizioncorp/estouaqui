import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middlewares/authMiddleware.js";
import { createReportSchema } from "./reports.schemas.js";
import { reportsService } from "./reports.service.js";

export const reportsController = {
  async createReport(request: AuthenticatedRequest, response: Response) {
    const data = createReportSchema.parse(request.body);
    const result = await reportsService.createReport(
      request.user!.id,
      request.user!.role,
      data
    );
    response.status(201).json(result);
  }
};
