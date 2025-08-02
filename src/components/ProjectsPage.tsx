'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import {
  Star,
  FileText,
  Clock,
  Code,
  Loader2,
  Grid3x3,
  List,
  Sparkles,
  Plus,
  Archive,
  Calendar,
  FolderOpen,
  Search,
  X,
  Trash2,
  ExternalLink
} from 'lucide-react';

import { getProjects, updateProject, deleteProject, createProject, getProjectStats, ProjectLimitError, ProjectStats } from '@/services/projectService';
import { IProject } from '@/models/project';
import Navbar from './Navbar';
import NewProjectModal from './NewProjectModal';

// format date to relative time
const formatRelativeTime = (dateInput: string | Date) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  const weeks = Math.floor(diffInSeconds / 604800);
  return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
};

const formatDate = (dateInput: string | Date) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function ProjectsPage() {
  const { status } = useSession();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'starred' | 'recent' | 'archived'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'created'>('recent');
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  
  const router = useRouter();

  // redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, router]);

  // fetch projects on component mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProjects();
    }
  }, [status]);

  // Fetch projects from the API
  async function fetchProjects() {
    try {
      setLoading(true);
      const [projectsData, statsData] = await Promise.all([
        getProjects(),
        getProjectStats()
      ]);
      setProjects(projectsData);
      setProjectStats(statsData);
    } catch (error) {
      console.error('error fetching projects-', error);
      toast.error("Failed to fetch projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // filter and sort projects
  const filteredAndSortedProjects = React.useMemo(() => {
    const filtered = projects.filter(project => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (project.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        
      if (filterType === 'starred') {
        return matchesSearch && project.starred;
      } else if (filterType === 'recent') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return matchesSearch && new Date(project.lastUpdated) >= oneWeekAgo;
      } else if (filterType === 'archived') {
        // for now, we don't have archived projects, so return empty
        return false;
      }
      
      return matchesSearch;
    });

    // sort projects
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else { // recent (default)
        // starred projects first, then by last updated
        if (a.starred !== b.starred) {
          return a.starred ? -1 : 1;
        }
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
    });

    return filtered;
  }, [projects, searchTerm, filterType, sortBy]);

  const toggleStar = async (id: string) => {
    try {
      const project = projects.find(p => p.id === id);
      if (!project) return;
      
      const updatedProject = await updateProject(id, { starred: !project.starred });
      
      setProjects(projects.map(p => 
        p.id === id ? updatedProject : p
      ));
      
      toast.success(updatedProject.starred ? "project starred" : "project unstarred");
    } catch (error) {
      console.error('error toggling star-', error);
      toast.error("failed to update project. please try again.");
    }
  };

  const handleDeleteProject = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      toast.success(`"${project.name}" has been deleted.`);
      
      // Refresh project stats
      const updatedStats = await getProjectStats();
      setProjectStats(updatedStats);
    } catch (error) {
      console.error('error deleting project-', error);
      toast.error("failed to delete project. please try again.");
    }
  };

  const handleCreateNewProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      setIsCreating(true);
      const newProject = await createProject({
        name: newProjectName,
        description: newProjectDescription,
      });

      setProjects([newProject, ...projects]);
      setNewProjectName('');
      setNewProjectDescription('');
      setShowNewProjectModal(false);
      toast.success("project created successfully!");
      
      // Refresh project stats
      const updatedStats = await getProjectStats();
      setProjectStats(updatedStats);
      
      router.push(`/projects/${newProject.id}`);
    } catch (error) {
      console.error('error creating project-', error);
      if (error instanceof ProjectLimitError) {
        toast.error(`Project limit reached! You can create up to ${error.maxProjects} projects.`);
      } else {
        toast.error("failed to create project. please try again.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloseModal = () => {
    setShowNewProjectModal(false);
    setNewProjectName('');
    setNewProjectDescription('');
  };

  // statistics
  const stats = React.useMemo(() => {
    const totalProjects = projects.length;
    const starredProjects = projects.filter(p => p.starred).length;
    const recentProjects = projects.filter(p => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(p.lastUpdated) >= oneWeekAgo;
    }).length;

    return { totalProjects, starredProjects, recentProjects };
  }, [projects]);

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navbar */}
      <Navbar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onNewProject={() => setShowNewProjectModal(true)}
      />

      {/* Main Content */}
      <main className="pt-20 w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-screen-2xl mx-auto">
          
          {/* Header with Stats */}
          <motion.div
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                  My Projects
                </h1>
                <p className="text-muted-foreground text-lg">
                  Organize and manage your markdown projects
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="p-4 text-center bg-gradient-to-br from-card to-card/50 border-primary/20">
                    <div className="text-2xl font-bold text-primary">{stats.totalProjects}</div>
                    <div className="text-xs text-muted-foreground">Total Projects</div>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <Card className={`p-4 text-center bg-gradient-to-br from-card to-card/50 border-primary/20 ${
                    projectStats?.isAtLimit ? 'border-red-500/30' : 'border-blue-500/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                      projectStats?.isAtLimit ? 'text-red-500' : 'text-blue-500'
                    }`}>
                      {projectStats?.remainingProjects ?? 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      of {projectStats?.maxProjects ?? 6} remaining
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="p-4 text-center bg-gradient-to-br from-card to-card/50 border-primary/20">
                    <div className="text-2xl font-bold text-yellow-500">{stats.starredProjects}</div>
                    <div className="text-xs text-muted-foreground">Starred</div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="p-4 text-center bg-gradient-to-br from-card to-card/50 border-primary/20">
                    <div className="text-2xl font-bold text-green-500">{stats.recentProjects}</div>
                    <div className="text-xs text-muted-foreground">Recent</div>
                  </Card>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Filters and Controls */}
          <motion.div
            className="mb-8 space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 rounded-full bg-background border border-muted text-sm focus:bg-background/80 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 rounded-full"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="inline-flex items-center rounded-lg bg-muted p-1 space-x-1">
                  {([
                    { key: 'all', label: 'All', icon: FolderOpen },
                    { key: 'starred', label: 'Starred', icon: Star },
                    { key: 'recent', label: 'Recent', icon: Clock },
                    { key: 'archived', label: 'Archived', icon: Archive }
                  ] as const).map((type) => (
                    <motion.div
                      key={type.key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="sm"
                        variant={filterType === type.key ? 'default' : 'ghost'}
                        className="capitalize"
                        onClick={() => setFilterType(type.key)}
                      >
                        <type.icon className="h-3 w-3 mr-1" />
                        {type.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sort and View Controls */}
              <div className="flex items-center gap-2">
                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-1 text-sm border border-muted rounded-md bg-background focus:ring-2 focus:ring-primary/20"
                >
                  <option value="recent">Recent First</option>
                  <option value="name">Name A-Z</option>
                  <option value="created">Date Created</option>
                </select>

                {/* View Mode */}
                <div className="inline-flex items-center rounded-lg bg-muted p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* New Project Button */}
                <div className="relative">
                  <Button 
                    onClick={() => setShowNewProjectModal(true)}
                    disabled={projectStats?.isAtLimit}
                    className={`bg-gradient-to-r transition-all ${
                      projectStats?.isAtLimit 
                        ? 'from-muted to-muted/80 text-muted-foreground cursor-not-allowed'
                        : 'from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
                    }`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {projectStats?.isAtLimit ? 'Project Limit Reached' : 'New Project'}
                  </Button>
                  {projectStats?.isAtLimit && (
                    <div className="absolute top-full left-0 mt-2 p-2 bg-card border rounded-md shadow-md text-xs text-muted-foreground whitespace-nowrap z-10">
                      You have reached the maximum of {projectStats.maxProjects} projects
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {filteredAndSortedProjects.length} {filteredAndSortedProjects.length === 1 ? 'project' : 'projects'}
                {filterType !== 'all' && ` in ${filterType}`}
              </span>
            </div>
          </motion.div>

          {/* Projects List */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                className="flex justify-center items-center h-64"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="relative">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <motion.div
                    className="absolute inset-0 h-12 w-12 rounded-full border-2 border-primary/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </motion.div>
            ) : filteredAndSortedProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-12 text-center border-dashed border-2 border-muted-foreground/20 bg-gradient-to-br from-muted/20 to-muted/5">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-6xl mb-4">
                      <Sparkles className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                    <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                      {searchTerm
                        ? "Try adjusting your search terms or create a new project."
                        : filterType === "starred"
                        ? "Star some projects to see them here."
                        : filterType === "recent"
                        ? "No recent updates found."
                        : filterType === "archived"
                        ? "No archived projects found."
                        : `Create your first project to get started! You can create up to ${projectStats?.maxProjects ?? 6} projects.`}
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        onClick={() => setShowNewProjectModal(true)} 
                        disabled={projectStats?.isAtLimit}
                        size="lg" 
                        className={`bg-gradient-to-r transition-all ${
                          projectStats?.isAtLimit 
                            ? 'from-muted to-muted/80 text-muted-foreground cursor-not-allowed'
                            : 'from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
                        }`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {projectStats?.isAtLimit ? 'Project Limit Reached' : 'Create Your First Project'}
                      </Button>
                    </motion.div>
                  </motion.div>
                </Card>
              </motion.div>
            ) : (
              <motion.div 
                className={viewMode === 'grid' ? 
                  "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : 
                  "space-y-4"
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {filteredAndSortedProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group"
                  >
                    <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="relative">
                              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                              <motion.div
                                className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-primary/30 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <Link href={`/projects/${project.id}`} className="font-semibold text-lg hover:text-primary transition-colors truncate block">
                                {project.name}
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  <Code size={10} className="mr-1"/>
                                  Markdown
                                </Badge>
                                {project.starred && (
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Action buttons - visible on hover */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.preventDefault();
                                toggleStar(project.id);
                              }}
                            >
                              <Star 
                                className={`h-4 w-4 transition-colors ${
                                  project.starred 
                                    ? "fill-yellow-400 text-yellow-400" 
                                    : "text-muted-foreground hover:text-yellow-400"
                                }`}
                              />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteProject(project.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {project.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatRelativeTime(project.lastUpdated)}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(project.createdAt)}
                            </span>
                          </div>
                          
                          <Link href={`/projects/${project.id}`}>
                            <motion.div
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={handleCloseModal}
        projectName={newProjectName}
        setProjectName={setNewProjectName}
        projectDescription={newProjectDescription}
        setProjectDescription={setNewProjectDescription}
        onCreateProject={handleCreateNewProject}
        isCreating={isCreating}
        currentCount={projectStats?.currentCount}
        maxProjects={projectStats?.maxProjects}
      />
    </div>
  );
}
