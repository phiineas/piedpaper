import { IProject } from '@/models/project';

// type for creating new projects
export type ProjectInput = {
  name: string;
  description?: string;
  content?: string;
  starred?: boolean;
};

// type for project statistics
export type ProjectStats = {
  currentCount: number;
  maxProjects: number;
  remainingProjects: number;
  canCreateMore: boolean;
  isAtLimit: boolean;
};

// custom error for project limit
export class ProjectLimitError extends Error {
  constructor(
    message: string,
    public currentCount: number,
    public maxProjects: number
  ) {
    super(message);
    this.name = 'ProjectLimitError';
  }
}

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
    console.log(res.status);
    console.log(await res.text());
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
    const errorData = await res.json().catch(() => ({}));
    if (res.status === 400 && errorData.currentCount !== undefined) {
      throw new ProjectLimitError(
        errorData.error || 'Project limit reached',
        errorData.currentCount,
        errorData.maxProjects
      );
    }
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

// get project statistics
export async function getProjectStats(): Promise<ProjectStats> {
  const res = await fetch('/api/projects/stats', {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('failed to fetch project stats');
  }
  
  return res.json();
}
