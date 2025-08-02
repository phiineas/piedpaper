'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import {
  Search,
  Copy,
  Eye,
  Filter,
  Grid3x3,
  List,
  Loader2,
  X,
  Sparkles,
  BookOpen,
  Download,
  Plus
} from 'lucide-react';

import { templates, categories, Template } from '@/data/templates';
import { createProject } from '@/services/projectService';
import Navbar from './Navbar';

export default function TemplatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreating, setIsCreating] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // redirect to sign-in if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, router]);

  // filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCreateFromTemplate = async (template: Template) => {
    if (!session?.user) return;
    
    setIsCreating(template.id);
    try {
      const newProject = await createProject({
        name: template.name,
        description: `Created from ${template.name} template - ${template.description}`,
        content: template.content
      });
      
      toast.success("Project created from template!");
      router.push(`/projects/${newProject.id}`);
    } catch (error) {
      console.error('Error creating project from template:', error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsCreating(null);
    }
  };

  const copyTemplateContent = (template: Template) => {
    navigator.clipboard.writeText(template.content);
    toast.success("Template content copied to clipboard!");
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
        onNewProject={() => router.push('/home')}
      />

      {/* Main Content */}
      <main className="pt-20 w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-screen-2xl mx-auto">
          
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center gap-3 mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative">
                <BookOpen className="h-12 w-12 text-primary" />
                <motion.div
                  className="absolute -top-1 -right-1 h-4 w-4 bg-primary/20 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Templates Library
              </h1>
            </motion.div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Jumpstart your projects with professionally crafted markdown templates
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="mb-8 space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 rounded-full"
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

            {/* Categories and View Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <motion.div
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="rounded-full"
                    >
                      {category === 'All' && <Filter className="h-3 w-3 mr-1" />}
                      {category}
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
                </span>
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
              </div>
            </div>
          </motion.div>

          {/* Templates Grid/List */}
          <AnimatePresence mode="wait">
            {filteredTemplates.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <Card className="max-w-md mx-auto p-8 border-dashed border-2 border-muted-foreground/20">
                  <Sparkles className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No templates found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or category filter.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                  >
                    Clear Filters
                  </Button>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                className={
                  viewMode === 'grid'
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Card className="h-full bg-gradient-to-br from-card to-card/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{template.icon}</div>
                            <div>
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                              <Badge variant="outline" className="mt-1">
                                {template.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-1 mb-4">
                          {template.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {template.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPreviewTemplate(template)}
                            className="flex-1"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyTemplateContent(template)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleCreateFromTemplate(template)}
                            disabled={isCreating === template.id}
                            className="bg-gradient-to-r from-primary to-primary/80"
                          >
                            {isCreating === template.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Plus className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Template Preview Modal */}
          <AnimatePresence>
            {previewTemplate && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setPreviewTemplate(null)}
                />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div
                    className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Card className="h-full bg-background/95 backdrop-blur-xl border-primary/20 shadow-2xl">
                      <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{previewTemplate.icon}</div>
                            <div>
                              <CardTitle className="text-xl">{previewTemplate.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {previewTemplate.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyTemplateContent(previewTemplate)}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleCreateFromTemplate(previewTemplate)}
                              disabled={isCreating === previewTemplate.id}
                            >
                              {isCreating === previewTemplate.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <Download className="h-4 w-4 mr-1" />
                              )}
                              Use Template
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setPreviewTemplate(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0 overflow-auto max-h-[calc(90vh-200px)]">
                        <pre className="p-6 text-sm whitespace-pre-wrap font-mono">
                          {previewTemplate.content}
                        </pre>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
