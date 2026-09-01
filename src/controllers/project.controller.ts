import { asyncHandler } from "../utils/asyncHandler";
import * as projectService from "../services/project.service";

export const getProjects = asyncHandler(async (req, res) => {
  const result = await projectService.getAllProjects(req.query as never);
  res.status(200).json({ success: true, ...result });
});

// پنل ادمین - همه پروژه‌ها (فعال و غیرفعال)، بدون صفحه‌بندی
export const getAllProjectsAdmin = asyncHandler(async (_req, res) => {
  const projects = await projectService.getAllProjectsAdmin();
  res.status(200).json({ success: true, data: projects });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);
  res.status(200).json({ success: true, data: project });
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.body);
  res.status(201).json({ success: true, data: project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(req.params.id, req.body);
  res.status(200).json({ success: true, data: project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(req.params.id);
  res.status(200).json({ success: true, message: "پروژه حذف شد." });
});
