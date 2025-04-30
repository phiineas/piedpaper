'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

import {
  Search,
  Plus,
  Filter,
  Star,
  ArrowRight,
  FileText,
  Clock,
  X,
  GitBranch,
  Code
} from 'lucide-react';

// mock data
const initialProjects = [
  {
    id: 'proj-1',
    name: 'Team Documentation',
    createdAt: '2025-04-15T10:30:00',
    lastUpdated: '2025-04-29T14:22:00',
    starred: true,
    description: 'Central documentation for the team with onboarding guides and processes'
  },
  {
    id: 'proj-2',
    name: 'Product Roadmap',
    createdAt: '2025-04-10T09:15:00',
    lastUpdated: '2025-04-30T11:05:00',
    starred: false,
    description: 'Strategic planning document for our Q2 product development goals'
  },
  {
    id: 'proj-3',
    name: 'Meeting Notes',
    createdAt: '2025-04-05T15:45:00',
    lastUpdated: '2025-04-28T16:30:00',
    starred: true,
    description: 'Collection of weekly meeting notes and action items'
  },
  {
    id: 'proj-4',
    name: 'API Documentation',
    createdAt: '2025-04-02T11:20:00',
    lastUpdated: '2025-04-25T13:15:00',
    starred: false,
    description: 'Technical documentation for our REST API endpoints and usage examples'
  }
];

// generate a unique project ID
const generateProjectId = () => {
  return `proj-${Math.random().toString(36).substring(2, 9)}`;
};

// format date to relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
};

export default function HomePage() {
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  
  const router = useRouter();

  // filter
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStar = (id: string) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, starred: !project.starred } : project
    ));
  };

  // new project
  const createNewProject = () => {
    if (!newProjectName.trim()) return;

    const newProject = {
      id: generateProjectId(),
      name: newProjectName,
      description: newProjectDescription,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      starred: false
    };

    setProjects([newProject, ...projects]);
    setNewProjectName('');
    setNewProjectDescription('');
    setShowNewProjectModal(false);

    router.push(`/${newProject.id}`);
  };

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto px-4">
      {/* top navigation */}
      <div className="flex items-center justify-between py-4 border-b">
        <div className="flex items-center">
          <FileText size={24} className="mr-2" />
          <h1 className="text-xl font-semibold">Pied Paper</h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search projects..." 
              className="pl-8 w-64" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => setShowNewProjectModal(true)} size="icon" variant="default">
                  <Plus size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create New Project</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* content area */}
      <div className="flex flex-1 py-6">
        {/* sidebar */}
        <div className="w-64 pr-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Your Projects</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Filter size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Filter Projects</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => setSearchTerm('')}
            >
              <FileText size={16} className="mr-2" />
              All Projects
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => setProjects(projects.filter(p => p.starred))}
            >
              <Star size={16} className="mr-2" />
              Starred
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                const sorted = [...projects].sort((a, b) => 
                  new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
                );
                setProjects(sorted);
              }}
            >
              <Clock size={16} className="mr-2" />
              Recent
            </Button>
          </div>
          
          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setShowNewProjectModal(true)}
            >
              <Plus size={16} className="mr-2" />
              New Project
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
            >
              <GitBranch size={16} className="mr-2" />
              Import Project
            </Button>
          </div>
        </div>

        {/* project list */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Projects</h1>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => {
                  const now = new Date().toISOString();
                  setProjects(projects.map(p => ({...p, lastUpdated: now})));
                }}
              >
                <Clock size={16} className="mr-2" />
                Update All
              </Button>
              <Button onClick={() => setShowNewProjectModal(true)}>
                <Plus size={16} className="mr-2" />
                New Project
              </Button>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-12">
              <FileText size={48} className="text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Try a different search term" : "Create your first Markdown project"}
              </p>
              <Button onClick={() => setShowNewProjectModal(true)}>
                <Plus size={16} className="mr-2" />
                Create Project
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:border-primary transition-colors duration-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Link href={`/${project.id}`} className="text-lg font-medium hover:underline">
                            {project.name}
                          </Link>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="ml-2 h-8 w-8"
                                  onClick={() => toggleStar(project.id)}
                                >
                                  <Star 
                                    size={16} 
                                    className={project.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}
                                  />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{project.starred ? "Unstar" : "Star"}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">{project.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Clock size={12} className="mr-1" />
                            Updated {formatRelativeTime(project.lastUpdated)}
                          </span>
                          <Separator orientation="vertical" className="mx-3 h-3" />
                          <span className="flex items-center">
                            <Code size={12} className="mr-1" />
                            Markdown
                          </span>
                        </div>
                      </div>
                      <Link href={`/${project.id}`}>
                        <Button variant="ghost" size="icon">
                          <ArrowRight size={16} />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* new project modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Create New Project</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowNewProjectModal(false)}>
                <X size={18} />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Project Name</label>
                  <Input
                    type="text"
                    placeholder="Enter project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="mt-1"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description (optional)</label>
                  <Input
                    type="text"
                    placeholder="Brief description of your project"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setShowNewProjectModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createNewProject} disabled={!newProjectName.trim()}>
                    Create Project
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
