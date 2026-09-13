import { Product } from "../models/Product.model";
import { Project } from "../models/Project.model";
import { Magazine } from "../models/Magazine.model";

export interface SitemapEntry {
  slug: string;
  updatedAt: Date;
}

// فقط slug و updatedAt محصولات فعال - بدون pagination، بدون گرفتن کل document
export const getActiveProductEntries = async (): Promise<SitemapEntry[]> => {
  return Product.find({ isActive: true })
    .select("slug updatedAt -_id")
    .lean();
};

export const getActiveProjectEntries = async (): Promise<SitemapEntry[]> => {
  return Project.find({ isActive: true })
    .select("slug updatedAt -_id")
    .lean();
};

export const getPublishedMagazineEntries = async (): Promise<SitemapEntry[]> => {
  return Magazine.find({ isPublished: true })
    .select("slug updatedAt -_id")
    .lean();
};

export const getSitemapData = async () => {
  const [products, projects, magazines] = await Promise.all([
    getActiveProductEntries(),
    getActiveProjectEntries(),
    getPublishedMagazineEntries(),
  ]);

  return { products, projects, magazines };
};
