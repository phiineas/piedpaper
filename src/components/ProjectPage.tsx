'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import {
  ChevronLeft,
  Settings,
  Save,
  Share2,
  Star,
  Clock,
  Trash2,
  FileText,
  Pencil,
  History,
  X,
  Loader2
} from 'lucide-react';

import MarkdownEditor from './MarkdownEditor';
import { getProject, updateProject, deleteProject as apiDeleteProject } from '@/services/projectService';
import { IProject } from '@/models/project';

// format date for display
const formatDate = (dateInput: string | Date | undefined) => {
  if (!dateInput) return 'N/A';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString(undefined, options);
};

interface ProjectPageProps {
  id: string;
}

export default function ProjectPage({ id }: ProjectPageProps) {
  const router = useRouter();
  // const params = useParams();
  // const id = params?.id as string;

  const [project, setProject] = useState<IProject | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectNameInput, setProjectNameInput] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjectData = useCallback(async () => {
    if (id) {
      setIsLoading(true);
      try {
        const projectData = await getProject(id);
        setProject(projectData);
        setProjectNameInput(projectData.name);
        setMarkdownContent(projectData.content || '');
      } catch (error) {
        console.error('failed to fetch project-', error);
        // toast({
        //   title: "error",
        //   description: "failed to load project. please try again.",
        //   variant: "destructive",
        // });
        toast.error("error", {
          description: "failed to load project. please try again.",
        });
        router.push('/home'); // redirect if project not found or error
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, router]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const handleContentChange = (newContent: string) => {
    setMarkdownContent(newContent);
  };

  const toggleStar = async () => {
    if (!project) return;
    setIsSaving(true);
    try {
      const updated = await updateProject(project.id, { starred: !project.starred });
      setProject(updated);
      // toast({
      //   title: updated.starred ? "Project Starred" : "Project Unstarred",
      //   duration: 2000,
      // });
      toast.message(updated.starred ? "Project Starred" : "Project Unstarred", {
        duration: 2000,
      });
    } catch (error) {
      console.error('failed to toggle star-', error);
      // toast({
      //   title: "error",
      //   description: "could not update star status.",
      //   variant: "destructive",
      // });
      toast.error("error", {
        description: "could not update star status.",
      })
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!project) return;
    setIsSaving(true);
    try {
      const updated = await updateProject(project.id, {
        content: markdownContent,
        lastUpdated: new Date(),
      });
      setProject(updated);
      // toast({
      //   title: "project saved",
      //   description: "your changes have been saved successfully.",
      // });
      toast.success("project saved", {
        description: "your changes have been saved successfully.",
      });
    } catch (error) {
      console.error('failed to save project:', error);
      // toast({
      //   title: "error",
      //   description: "could not save project. please try again.",
      //   variant: "destructive",
      // });
      toast.error("error", {
        description: "could not save project. please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProjectName = async () => {
    if (!project || !projectNameInput.trim()) {
      if (project) setProjectNameInput(project.name);
      setIsEditingName(false);
      return;
    }
    setIsSaving(true);
    try {
      const updated = await updateProject(project.id, {
        name: projectNameInput.trim(),
        lastUpdated: new Date(),
      });
      setProject(updated);
      setIsEditingName(false);
      // toast({
      //   title: "project name updated",
      //   description: `project name changed to "${updated.name}".`,
      // });
      toast.success("project name updated", {
        description: `project name changed to "${updated.name}".`,
      });
    } catch (error) {
      console.error('failed to save project name:', error);
      // toast({
      //   title: "error",
      //   description: "could not update project name.",
      //   variant: "destructive",
      // });
      toast.error("error", {
        description: "could not update project name.",
      });
      if (project) setProjectNameInput(project.name); // revert on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    setIsDeleting(true);
    try {
      await apiDeleteProject(project.id);
      // toast({
      //   title: "rroject deleted",
      //   description: `"${project.name}" has been deleted.`,
      // });
      toast.success("project deleted", {
        description: `"${project.name}" has been deleted.`,
      });
      setShowDeleteModal(false);
      router.push('/');
    } catch (error) {
      console.error('dailed to delete project-', error);
      // toast({
      //   title: "error",
      //   description: "could not delete project. please try again.",
      //   variant: "destructive",
      // });
      toast.error("error", {
        description: "could not delete project. please try again.",
      });
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <FileText size={48} className="text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The project you are looking for does not exist or could not be loaded.
        </p>
        <Link href="/home">
          <Button>Go to Homepage</Button>
        </Link>
      </div>
    );
  }

  console.log("markdownContent", markdownContent);
  console.log("project", project);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-card border-b py-3 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="mr-2">
                <ChevronLeft size={18} />
              </Button>
            </Link>

            {isEditingName ? (
              <div className="flex items-center">
                <Input
                  value={projectNameInput}
                  onChange={(e) => setProjectNameInput(e.target.value)}
                  className="h-8 text-lg font-semibold"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveProjectName();
                    if (e.key === 'Escape') {
                      setProjectNameInput(project.name);
                      setIsEditingName(false);
                    }
                  }}
                  disabled={isSaving}
                />
                <Button variant="ghost" size="icon" onClick={handleSaveProjectName} className="ml-1" disabled={isSaving}>
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => {
                  setProjectNameInput(project.name);
                  setIsEditingName(false);
                }} disabled={isSaving}>
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <h1 className="text-lg font-semibold flex items-center">
                  <FileText size={18} className="mr-2" />
                  {project.name}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-7 w-7"
                  onClick={() => {
                    setProjectNameInput(project.name)
                    setIsEditingName(true)
                  }}
                >
                  <Pencil size={12} />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleStar}
                    className="text-muted-foreground"
                    disabled={isSaving}
                  >
                    {isSaving && project.starred ? <Loader2 size={16} className="animate-spin" /> : <Star
                      size={16}
                      className={project.starred ? "fill-yellow-400 text-yellow-400" : ""}
                    />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{project.starred ? 'Unstar' : 'Star'}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground" disabled>
                    <History size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>History (Coming Soon)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground" disabled>
                    <Share2 size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share (Coming Soon)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleSave} variant="outline" size="sm" disabled={isSaving}>
                    {isSaving ? <Loader2 size={14} className="mr-1 animate-spin" /> : <Save size={14} className="mr-1" />}
                    Save
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save Changes</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDeleteModal(true)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Project</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      <div className="bg-muted/50 border-b px-4 py-2">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Clock size={14} className="mr-1" />
              Last updated: {formatDate(project.lastUpdated)}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <Badge variant="outline" className="font-normal">Markdown</Badge>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7" disabled>
                  <Settings size={14} className="mr-1" />
                  Settings
                </Button>
              </TooltipTrigger>
              <TooltipContent>Project Settings (Coming Soon)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <MarkdownEditor
          initialContent={markdownContent}
          onContentChange={handleContentChange}
        />
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2">Delete Project</h2>
              <p className="text-muted-foreground mb-4">
                Are you sure you want to delete &quot;{project.name}&quot;? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteProject} disabled={isDeleting}>
                  {isDeleting ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                  Delete Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
