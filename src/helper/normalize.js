// Normalization helpers for Job Profile sections
// Converts various incoming shapes into a unified
// { title: string, items: Array<{ name: string, values: string[] }> } structure.

export const parseValues = (values) => {
  if (Array.isArray(values)) return values;
  if (typeof values === "string") {
    try {
      const parsed = JSON.parse(values);
      return Array.isArray(parsed) ? parsed : (values ? [values] : []);
    } catch {
      return values ? [values] : [];
    }
  }
  if (values == null) return [];
  // Any other primitive
  return [String(values)];
};

export const pretty = (str) =>
  typeof str === "string"
    ? str.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase())
    : "";

// Normalize an incoming section into a {title, items[]} object
export const normalizeSection = (section, fallbackTitle) => {
  if (!section) return null;

  if (Array.isArray(section)) {
    // Likely job_performance_standards: [{ name, values }]
    return {
      title: fallbackTitle || "Details",
      items: section.map((it) => ({
        name: pretty(it?.name ?? ""),
        values: parseValues(it?.values),
      })),
    };
  }

  if (section.title && Array.isArray(section.items)) {
    return section;
  }

  if (typeof section === "object") {
    // Convert object entries into items
    const entries = Object.entries(section);
    const items = entries.map(([key, val]) => ({
      name: pretty(key),
      values: parseValues(val),
    }));
    return { title: fallbackTitle || "Details", items };
  }

  return null;
};

// Build sections array for the DropdownGrid
export const buildDropdownSections = (
  performanceStandards,
  jobSpecifications,
  reportingRelationships,
  levelsOfAuthority
) => {
  return [
    normalizeSection(performanceStandards, "Job Performance Standards"),
    normalizeSection(jobSpecifications, "Job Specifications"),
    normalizeSection(reportingRelationships, "Reporting Relationships"),
    normalizeSection(levelsOfAuthority, "Levels of Authority"),
  ].filter((s) => s && Array.isArray(s.items) && s.items.length > 0);
};
