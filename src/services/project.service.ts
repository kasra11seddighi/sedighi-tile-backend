import { Project } from "../models/Project.model";
import { ApiError } from "../utils/ApiError";
import { slugify } from "../utils/slugify";
import {
  CreateProjectInput,
  UpdateProjectInput,
  GetProjectsQuery,
} from "../validations/project.validation";

export const getAllProjects = async (query: GetProjectsQuery) => {
  const { search, category, page = 1, limit = 9, sort = "-createdAt" } = query;

  const filter: Record<string, unknown> = { isActive: true };

  if (search) {
    filter.$text = { $search: search };
  }

  if (category) {
    filter.category = category;
  }

  const skip = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit),

    Project.countDocuments(filter),
  ]);

  return {
    projects,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

// پنل ادمین - همه پروژه‌ها (فعال و غیرفعال)، بدون صفحه‌بندی
export const getAllProjectsAdmin = async () => {
  return Project.find().populate("category", "name slug").sort({ createdAt: -1 });
};

export const getProjectById = async (id: string) => {
  const project = await Project.findById(id).populate("category", "name slug");

  if (!project) {
    throw new ApiError(404, "پروژه یافت نشد.");
  }

  return project;
};

export const createProject = async (data: CreateProjectInput) => {
  const slug = slugify(data.title);
  return Project.create({ ...data, slug });
};

export const updateProject = async (id: string, data: UpdateProjectInput) => {
  const payload: UpdateProjectInput & { slug?: string } = { ...data };
  if (payload.title) payload.slug = slugify(payload.title);

  const project = await Project.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    throw new ApiError(404, "پروژه یافت نشد.");
  }

  return project;
};

export const deleteProject = async (id: string) => {
  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    throw new ApiError(404, "پروژه یافت نشد.");
  }
  return project;
};
