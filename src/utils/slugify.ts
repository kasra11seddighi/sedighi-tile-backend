// یک منبع مشترک برای slugify — قبلاً در productService و categoryService تکراری تعریف شده بود.
export const slugify = (text: string): string =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-\u0600-\u06FF]+/g, "");
