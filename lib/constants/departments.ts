/**
 * Centralized department list for SREC
 * Used throughout the application for dropdowns and filters
 */

export const DEPARTMENTS = [
  "Computer Science and Engineering",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Automobile Engineering",
  "Biomedical Engineering",
  "Information Technology",
  "Artificial Intelligence and Data Science",
  "Information and Communication Technology",
] as const;

export type Department = typeof DEPARTMENTS[number];

export const isDepartmentValid = (dept: string): boolean => {
  return DEPARTMENTS.includes(dept as Department);
};

export const getDepartmentLabel = (dept: string): string => {
  return isDepartmentValid(dept) ? dept : "Unknown Department";
};
