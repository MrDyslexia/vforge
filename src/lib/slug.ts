export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function uniqueSlug(base: string, exists: (slug: string) => boolean): string {
  let slug = base;
  let counter = 1;
  while (exists(slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}
