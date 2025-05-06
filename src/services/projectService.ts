import { IProject } from '@/models/project';

// type for creating new projects
export type ProjectInput = {
  name: string;
  description?: string;
  content?: string;
  starred?: boolean;
};

// get all projects
export async function getProjects(): Promise<IProject[]> {
  const res = await fetch('/api/projects', {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('failed to fetch projects');
  }
  
  return res.json();
}

// get project by ID
export async function getProject(id: string): Promise<IProject> {
  const res = await fetch(`/api/projects/${id}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('failed to fetch project');
  }
  
  return res.json();
}

// create a new project
export async function createProject(projectData: ProjectInput): Promise<IProject> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });
  
  if (!res.ok) {
    throw new Error('failed to create project');
  }
  
  return res.json();
}

// update a project
export async function updateProject(id: string, projectData: Partial<IProject>): Promise<IProject> {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });
  
  if (!res.ok) {
    throw new Error('failed to update project');
  }
  
  return res.json();
}

// delete a project
export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    throw new Error('failed to delete project');
  }
}
