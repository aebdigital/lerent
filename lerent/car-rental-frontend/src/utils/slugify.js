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
 * Generate unique slugs for a list of cars.
 * This ensures that if multiple cars have the same brand and model, they get unique slugs.
 */
export const getUniqueCarSlugs = (cars) => {
  const slugCounts = {};
  return cars.map(car => {
    const baseSlug = generateCarSlug(car.brand, car.model);
    if (!slugCounts[baseSlug]) {
      slugCounts[baseSlug] = 1;
      return { ...car, slug: baseSlug };
    } else {
      slugCounts[baseSlug]++;
      return { ...car, slug: `${baseSlug}-${slugCounts[baseSlug]}` };
    }
  });
};

/**
 * Find a car from a list by matching its slug.
 */
export const findCarBySlug = (cars, slug) => {
  const carsWithSlugs = getUniqueCarSlugs(cars);
  return carsWithSlugs.find(car => car.slug === slug);
};

