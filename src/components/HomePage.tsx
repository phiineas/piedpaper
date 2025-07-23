'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import {
  Star,
  ArrowRight,
  FileText,
  Clock,
  GitBranch,
  Code,
  Loader2,
  Grid3x3,
  List,
  BookOpen,
  Sparkles,
  Activity,
  Zap,
  Plus
} from 'lucide-react';

import { getProjects, createProject, updateProject } from '@/services/projectService';
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

export default function HomePage() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'starred' | 'recent'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
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

  // fetch projects from the API
  async function fetchProjects() {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('error fetching projects-', error);
      toast.error("failed to fetch projects. please try again.");
    } finally {
      setLoading(false);
    }
  }

  // filter projects with real search functionality
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (project.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
    if (filterType === 'starred') {
      return matchesSearch && project.starred;
    } else if (filterType === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return matchesSearch && new Date(project.lastUpdated) >= oneWeekAgo;
    }
    
    return matchesSearch;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
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
      
      toast.success(updatedProject.starred ? "Project starred" : "Project unstarred");
    } catch (error) {
      console.error('error toggling star-', error);
      toast.error("failed to update project. please try again.");
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
      router.push(`/projects/${newProject.id}`);
    } catch (error) {
      console.error('error creating project-', error);
      toast.error("failed to create project. please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloseModal = () => {
    setShowNewProjectModal(false);
    setNewProjectName('');
    setNewProjectDescription('');
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navbar */}
      <Navbar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onNewProject={() => setShowNewProjectModal(true)}
      />

      {/* Main Content - Add top padding for fixed navbar */}
      <main className="pt-25 w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 max-w-screen-2xl mx-auto">
          {/* Sidebar */}
          <motion.aside 
            className="lg:w-80 space-y-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Profile Card */}
            <Card className="overflow-hidden bg-gradient-to-br from-card to-card/50 border-primary/20">
              <CardContent className="p-6">
                <motion.div 
                  className="flex items-center space-x-3 mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center relative">
                    <FileText className="h-6 w-6 text-primary" />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary/10"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">Welcome back, {session?.user?.name || 'Writer'}!</h3>
                    <p className="text-sm text-muted-foreground">Ready to continue writing?</p>
                  </div>
                </motion.div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {projects.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Projects</div>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {projects.filter(p => {
                        const oneWeekAgo = new Date();
                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                        return new Date(p.lastUpdated) >= oneWeekAgo;
                      }).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Recent</div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: Plus, label: 'New Project', action: () => setShowNewProjectModal(true) },
                  { icon: GitBranch, label: 'Import Project', action: () => {} },
                  { icon: BookOpen, label: 'Browse Templates', action: () => {} },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                      onClick={item.action}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {projects.slice(0, 3).map((project, index) => (
                    <motion.div 
                      key={project.id} 
                      className="flex items-start space-x-2 text-sm"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <div className={`h-2 w-2 rounded-full mt-2 ${
                        index === 0 ? 'bg-green-500' : 
                        index === 1 ? 'bg-blue-500' : 'bg-purple-500'
                      }`}></div>
                      <div>
                        <span className="font-medium">Updated</span> {project.name}
                        <div className="text-muted-foreground text-xs">
                          {formatRelativeTime(project.lastUpdated)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.aside>

          <Separator orientation="vertical" className="hidden lg:block h-auto" />

          {/* Main Content Area */}
          <motion.div 
            className="flex-1 space-y-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Projects Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Your Projects
                </h2>
                <p className="text-muted-foreground">
                  {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
                  {filterType === 'starred' && ' starred'}
                  {filterType === 'recent' && ' updated recently'}
                </p>
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap items-center gap-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="inline-flex items-center rounded-lg bg-muted p-1 space-x-1">
                  {(['all', 'starred', 'recent'] as const).map((type) => (
                    <motion.div
                      key={type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="sm"
                        variant={filterType === type ? 'default' : 'ghost'}
                        className="capitalize"
                        onClick={() => setFilterType(type)}
                      >
                        {type === 'starred' && <Star className="h-3 w-3 mr-1" />}
                        {type === 'recent' && <Clock className="h-3 w-3 mr-1" />}
                        {type}
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <div className="inline-flex items-center rounded-lg bg-muted p-1 space-x-1">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>          
            </div>

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
              ) : sortedProjects.length === 0 ? (
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
                          : "Create your first project to get started with your markdown journey!"}
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button onClick={() => setShowNewProjectModal(true)} size="lg" className="bg-gradient-to-r from-primary to-primary/80">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Project
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
                  {sortedProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
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
                              <Link href={`/projects/${project.id}`} className="font-semibold text-lg hover:text-primary transition-colors truncate">
                                {project.name}
                              </Link>
                            </div>
                            
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
                            </motion.div>
                          </div>
                          
                          {project.description && (
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                              {project.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center bg-primary/10 px-2 py-1 rounded-full">
                                <Code size={12} className="mr-1"/>
                                Markdown
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatRelativeTime(project.lastUpdated)}
                              </span>
                            </div>
                            
                            <Link href={`/projects/${project.id}`}>
                              <motion.div
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ArrowRight className="h-4 w-4" />
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
          </motion.div>
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
      />
    </div>
  );
}
