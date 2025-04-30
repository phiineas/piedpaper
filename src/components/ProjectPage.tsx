'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  X
} from 'lucide-react';

import MarkdownEditor from './MarkdownEditor';

const getProjectData = (id: string) => {
  return {
    id,
    name: id === 'proj-1' ? 'Team Documentation' : 
          id === 'proj-2' ? 'Product Roadmap' : 
          id === 'proj-3' ? 'Meeting Notes' : 
          id === 'proj-4' ? 'API Documentation' : `Project ${id}`,
    description: 'This is a markdown editor project for collaborative documentation.',
    createdAt: '2025-04-15T10:30:00',
    lastUpdated: '2025-04-29T14:22:00',
    starred: false,
    content: `# Welcome to ${id === 'proj-1' ? 'Team Documentation' : 
              id === 'proj-2' ? 'Product Roadmap' : 
              id === 'proj-3' ? 'Meeting Notes' : 
              id === 'proj-4' ? 'API Documentation' : `Project ${id}`}

## Getting Started

This markdown editor allows you to:
- Write formatted content with ease
- Preview your changes in real-time
- Share documentation with your team

## Features

| Feature | Description |
|---------|-------------|
| Real-time Preview | See your changes as you type |
| Toolbar | Quick access to formatting options |
| Keyboard Shortcuts | Work faster with shortcuts |

> "Documentation is like sex: when it's good, it's very good; when it's bad, it's better than nothing." - Dick Brandon

\`\`\`javascript
// Example code
function saveDocument() {
  localStorage.setItem('document', JSON.stringify(content));
  console.log('Document saved!');
}
\`\`\`

Start editing now by clicking on this text!`
  };
};

// format date for display
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.projectId as string;
  
  const [project, setProject] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    if (projectId) {
      const projectData = getProjectData(projectId);
      setProject(projectData);
      setProjectName(projectData.name);
    }
  }, [projectId]);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const toggleStar = () => {
    setProject({
      ...project,
      starred: !project.starred
    });
  };

  const handleSave = () => {
    // save the project data to local storage or backend
    setProject({
      ...project,
      lastUpdated: new Date().toISOString()
    });
    alert('Project saved successfully!');
  };

  const handleSaveProjectName = () => {
    if (projectName.trim()) {
      setProject({
        ...project,
        name: projectName,
        lastUpdated: new Date().toISOString()
      });
    } else {
      setProjectName(project.name);
    }
    setIsEditingName(false);
  };

  const handleDeleteProject = () => {
    // delete the project from local storage or backend
    setShowDeleteModal(false);
    router.push('/');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* header */}
      <header className="bg-card border-b py-3 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <ChevronLeft size={18} />
              </Button>
            </Link>
            
            {isEditingName ? (
              <div className="flex items-center">
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="h-8 text-lg font-semibold"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveProjectName();
                    if (e.key === 'Escape') {
                      setProjectName(project.name);
                      setIsEditingName(false);
                    }
                  }}
                />
                <Button variant="ghost" size="icon" onClick={handleSaveProjectName} className="ml-1">
                  <Save size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => {
                  setProjectName(project.name);
                  setIsEditingName(false);
                }}>
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
                  onClick={() => setIsEditingName(true)}
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
                  >
                    <Star 
                      size={16} 
                      className={project.starred ? "fill-yellow-400 text-yellow-400" : ""} 
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{project.starred ? 'Unstar' : 'Star'}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <History size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>History</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Share2 size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleSave} variant="outline" size="sm">
                    <Save size={14} className="mr-1" />
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

      {/* project bar */}
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
                <Button variant="ghost" size="sm" className="h-7">
                  <Settings size={14} className="mr-1" />
                  Settings
                </Button>
              </TooltipTrigger>
              <TooltipContent>Project Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* main editor area */}
      <div className="flex-1 overflow-hidden">
        <MarkdownEditor />
      </div>

      {/* delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2">Delete Project</h2>
              <p className="text-muted-foreground mb-4">
                Are you sure you want to delete &quot;{project.name}&quot;? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteProject}>
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
