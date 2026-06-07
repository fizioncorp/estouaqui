import type { Request, Response } from "express";
import { z } from "zod";
import { adminService } from "./admin.service.js";
import { reportsService } from "../reports/reports.service.js";
import { updateReportStatusSchema } from "../reports/reports.schemas.js";

function getRouteParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value || "";
}

const reasonSchema = z.object({
  reason: z.string().max(500).optional()
});

export const adminController = {
  async dashboard(_request: Request, response: Response) {
    const result = await adminService.dashboard();
    response.json(result);
  },

  async volunteers(_request: Request, response: Response) {
    const result = await adminService.listVolunteers();
    response.json(result);
  },

  async approveVolunteer(request: Request, response: Response) {
    const result = await adminService.approveVolunteer(getRouteParam(request.params.id));
    response.json(result);
  },

  async rejectVolunteer(request: Request, response: Response) {
    const data = reasonSchema.parse(request.body);
    const result = await adminService.rejectVolunteer(
      getRouteParam(request.params.id),
      data.reason
    );
    response.json(result);
  },

  async blockVolunteer(request: Request, response: Response) {
    const data = reasonSchema.parse(request.body);
    const result = await adminService.blockVolunteer(
      getRouteParam(request.params.id),
      data.reason
    );
    response.json(result);
  },

  async reportedConversations(_request: Request, response: Response) {
    const result = await adminService.reportedConversations();
    response.json(result);
  },

  async reports(_request: Request, response: Response) {
    const result = await reportsService.getAdminReports();
    response.json(result);
  },

  async safetyEvents(_request: Request, response: Response) {
    const result = await adminService.safetyEvents();
    response.json(result);
  },

  async updateReportStatus(request: Request, response: Response) {
    const data = updateReportStatusSchema.parse(request.body);
    const result = await adminService.updateReportStatus(
      getRouteParam(request.params.id),
      data.status
    );
    response.json(result);
  }
};
