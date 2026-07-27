export interface Course {
  id: number;
  name: string;
  code: string;
  credits: number;
  gradeStatus: string;
  duration?: string;
  fees?: number;
}