/**
 * Generate a URL-friendly slug from car brand and model.
 * E.g., "Škoda", "Octavia 4 Combi AT" → "skoda-octavia-4-combi-at"
 */
export const generateCarSlug = (brand, model) => {
  const text = `${brand} ${model}`;
  return text
    .normalize('NFD')                   // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '')    // Remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')      // Remove non-alphanumeric chars
    .replace(/\s+/g, '-')              // Replace spaces with hyphens
    .replace(/-+/g, '-')              // Collapse multiple hyphens
    .replace(/^-|-$/g, '');            // Trim leading/trailing hyphens
};

/**
 * Find a car from a list by matching its slug.
 */
export const findCarBySlug = (cars, slug) => {
  return cars.find(car => generateCarSlug(car.brand, car.model) === slug);
};
