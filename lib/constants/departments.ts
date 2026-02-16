export const DEPARTMENTS = [
  'Artificial Intelligence and Data Science',
  'Artificial Intelligence and Machine Learning',
  'Biomedical Engineering',
  'Civil Engineering',
  'Computer Science and Business Systems',
  'Computer Science and Engineering',
  'Electrical and Electronics Engineering',
  'Electronics and Communication Engineering',
  'Electronics and Instrumentation Engineering',
  'Information Technology',
  'Mechanical Engineering',
  'Robotics and Automation',
] as const;

export type Department = typeof DEPARTMENTS[number];

export const ACADEMIC_YEARS = [
  'First Year',
  'Second Year',
  'Third Year',
  'Fourth Year',
] as const;

export type AcademicYear = typeof ACADEMIC_YEARS[number];
