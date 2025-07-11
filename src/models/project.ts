import { Project, InsertProject } from '@/lib/schema';

// re-export the types from the schema
export type IProject = Project;
export type ProjectInput = InsertProject;

// for backwards compatibility, also export the interface
export interface IProjectInterface {
  id: string;
  name: string;
  description?: string;
  content?: string;
  starred?: boolean;
  createdAt?: Date;
  lastUpdated?: Date;
}
