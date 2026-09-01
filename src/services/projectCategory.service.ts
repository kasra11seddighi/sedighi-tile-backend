import { ProjectCategory } from "../models/ProjectCategory.model";
import { Project } from "../models/Project.model";
import { ApiError } from "../utils/ApiError";
import { slugify } from "../utils/slugify";
import {
  CreateProjectCategoryInput,
  UpdateProjectCategoryInput,
} from "../validations/projectCategory.validation";

export const getAllProjectCategories = async () => {
  return ProjectCategory.find().sort({ createdAt: -1 });
};

export const getProjectCategoryById = async (id: string) => {
  const category = await ProjectCategory.findById(id);
  if (!category) throw new ApiError(404, "دسته‌بندی پروژه یافت نشد.");
  return category;
};

export const createProjectCategory = async ({
  name,
  description,
}: CreateProjectCategoryInput) => {
  const slug = slugify(name);
  return ProjectCategory.create({ name, description, slug });
};

export const updateProjectCategory = async (
  id: string,
  data: UpdateProjectCategoryInput,
) => {
  const payload: UpdateProjectCategoryInput & { slug?: string } = { ...data };
  if (payload.name) payload.slug = slugify(payload.name);

  const category = await ProjectCategory.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new ApiError(404, "دسته‌بندی پروژه یافت نشد.");
  return category;
};

export const deleteProjectCategory = async (id: string) => {
  // قبل از حذف چک می‌کنیم پروژه‌ای به این دسته‌بندی وصل نباشه؛ وگرنه
  // پروژه‌ها با یک رفرنس یتیم (category حذف‌شده) باقی می‌مونن.
  const inUse = await Project.exists({ category: id });
  if (inUse) {
    throw new ApiError(
      409,
      "این دسته‌بندی در حال حاضر روی حداقل یک پروژه استفاده شده و قابل حذف نیست.",
    );
  }

  const category = await ProjectCategory.findByIdAndDelete(id);
  if (!category) throw new ApiError(404, "دسته‌بندی پروژه یافت نشد.");
  return category;
};
