export interface Profile {
  id: string;
  linkedinUrl: string;
  name: string;
  title: string;
  summary: string;
  experience: string[];
  education: string[];
  tags: string[];
  rawText: string;
  createdAt: number;
}
