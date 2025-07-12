'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

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
  Code,
  Loader2,
  LogOut,
} from 'lucide-react';

import { getProjects, createProject, updateProject } from '@/services/projectService';
import { IProject } from '@/models/project';

// format date to relative time
const formatRelativeTime = (dateInput: string | Date) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
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
  const { status } = useSession();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'starred' | 'recent'>('all');
  
  const router = useRouter();

  // redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // fetch projects on component mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProjects();
    }
  }, [status]);

  // fetch projects from the API
  async function fetchProjects() {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('error fetching projects-', error);
      // toast({
      //   title: "error",
      //   description: "failed to fetch projects. please try again.",
      //   variant: "destructive",
      // });
      toast.error("error", {
        description: "failed to fetch projects. please try again.",
      })
    } finally {
      setLoading(false);
    }
  }

  // filter
  const filteredProjects = projects.filter(project => {
    // search term filter
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (project.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
    // type filter
    if (filterType === 'starred') {
      return matchesSearch && project.starred;
    } else if (filterType === 'recent') {
      // recent projects (past week)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return matchesSearch && new Date(project.lastUpdated) >= oneWeekAgo;
    }
    
    return matchesSearch;
  });

  // apply sorting
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    // Always show starred projects first if viewing all
    if (filterType === 'all' && a.starred !== b.starred) {
      return a.starred ? -1 : 1;
    }
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
  });

  const toggleStar = async (id: string) => {
    try {
      const project = projects.find(p => p.id === id);
      if (!project) return;
      
      const updatedProject = await updateProject(id, { starred: !project.starred });
      
      setProjects(projects.map(p => 
        p.id === id ? updatedProject : p
      ));
      
      // toast({
      //   title: updatedProject.starred ? "Project starred" : "Project unstarred",
      //   duration: 2000,
      // });
      toast.message(updatedProject.starred ? "Project starred" : "Project unstarred", {
        duration: 2000,
      });
    } catch (error) {
      console.error('error toggling star-', error);
      // toast({
      //   title: "error",
      //   description: "failed to update project. please try again.",
      //   variant: "destructive",
      // });
      toast.error("error", {
        description: "failed to update project. please try again.",
      });
    }
  };

  // create new project
  const createNewProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      const newProject = await createProject({
        name: newProjectName,
        description: newProjectDescription,
      });

      setProjects([newProject, ...projects]);
      setNewProjectName('');
      setNewProjectDescription('');
      setShowNewProjectModal(false);

      // toast({
      //   title: "success",
      //   description: "project created successfully!",
      // });
      toast.success("success", {
        description: "project created successfully!",
      });

      router.push(`/projects/${newProject.id}`);
    } catch (error) {
      console.error('error creating project-', error);
      // toast({
      //   title: "error",
      //   description: "failed to create project. please try again.",
      //   variant: "destructive",
      // });
      toast.error("error", {
        description: "failed to create project. please try again.",
      });
    }
  };

  // don't render anything while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // don't render anything if not authenticated (will redirect)
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto px-4">
      {/* toaster component */}
      {/* <Toaster position="bottom-right" /> */}
      
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => signOut()}
                  size="icon"
                  variant="outline"
                >
                  <LogOut size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sign Out</TooltipContent>
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
              variant={filterType === 'all' ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setFilterType('all')}
            >
              <FileText size={16} className="mr-2" />
              All Projects
            </Button>
            <Button 
              variant={filterType === 'starred' ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setFilterType('starred')}
            >
              <Star size={16} className="mr-2" />
              Starred
            </Button>
            <Button 
              variant={filterType === 'recent' ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setFilterType('recent')}
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
            <h1 className="text-2xl font-bold">
              {filterType === 'all' ? 'All Projects' : 
              filterType === 'starred' ? 'Starred Projects' : 'Recent Projects'}
            </h1>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={fetchProjects}
              >
                <Clock size={16} className="mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setShowNewProjectModal(true)}>
                <Plus size={16} className="mr-2" />
                New Project
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sortedProjects.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-12">
              <FileText size={48} className="text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Try a different search term" : 
                filterType === 'starred' ? "Star some projects to see them here" :
                filterType === 'recent' ? "No recent projects found" :
                "Create your first Markdown project"}
              </p>
              <Button onClick={() => setShowNewProjectModal(true)}>
                <Plus size={16} className="mr-2" />
                Create Project
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sortedProjects.map((project) => (
                <Card key={project.id} className="hover:border-primary transition-colors duration-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Link href={`/projects/${project.id}`} className="text-lg font-medium hover:underline">
                            {project.name}
                          </Link>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="ml-2 h-8 w-8"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleStar(project.id);
                                  }}
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
                      <Link href={`/projects/${project.id}`}>
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
