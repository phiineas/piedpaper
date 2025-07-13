'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Sparkles, Plus } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  setProjectName: (name: string) => void;
  projectDescription: string;
  setProjectDescription: (description: string) => void;
  onCreateProject: () => void;
  isCreating?: boolean;
}

export default function NewProjectModal({
  isOpen,
  onClose,
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
  onCreateProject,
  isCreating = false
}: NewProjectModalProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      onCreateProject();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              className="w-full max-w-lg"
            >
              <Card className="w-full bg-background/95 backdrop-blur-xl border-primary/20 shadow-2xl">
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="relative">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <motion.div
                          className="absolute inset-0"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="h-6 w-6 text-primary/30" />
                        </motion.div>
                      </div>
                      Create New Project
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={onClose}
                      className="h-8 w-8 p-0 hover:bg-muted"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start your new markdown project and bring your ideas to life.
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Project Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="lorem ipsum"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        autoFocus
                        disabled={isCreating}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Description
                      </label>
                      <Textarea
                        placeholder="gibsum dolor sit amet, consectetur adipiscing elit..."
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        className="min-h-[100px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
                        disabled={isCreating}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      Press <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Esc</kbd> to cancel or{' '}
                      <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Cmd+Enter</kbd> to create
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={onClose}
                        disabled={isCreating}
                      >
                        Cancel
                      </Button>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          onClick={onCreateProject} 
                          disabled={!projectName.trim() || isCreating}
                          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg min-w-[120px]"
                        >
                          {isCreating ? (
                            <motion.div
                              className="flex items-center gap-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <motion.div
                                className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              Creating...
                            </motion.div>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Create Project
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
