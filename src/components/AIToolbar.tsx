'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Sparkles,
  Type,
  FileText,
  Lightbulb,
  Loader2,
  ChevronDown,
  ChevronUp,
  Wand2,
  Bot,
  RefreshCw
} from 'lucide-react';

import { frontendAI, AIRequestType } from '@/services/frontendAI';

interface AIToolbarProps {
  selectedText: string;
  onTextReplace: (newText: string) => void;
  onTextInsert: (text: string) => void;
  className?: string;
}

interface AIAction {
  id: AIRequestType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const AI_ACTIONS: AIAction[] = [
  {
    id: 'completion',
    label: 'Complete Text',
    description: 'Continue writing from where you left off',
    icon: Type,
    color: 'bg-blue-500'
  },
  {
    id: 'formatting',
    label: 'Format Markdown',
    description: 'Improve markdown structure and formatting',
    icon: FileText,
    color: 'bg-green-500'
  },
  {
    id: 'technical-doc',
    label: 'Technical Docs',
    description: 'Enhance technical documentation',
    icon: Bot,
    color: 'bg-purple-500'
  },
  {
    id: 'improvement',
    label: 'Improve Text',
    description: 'Enhance clarity and readability',
    icon: Lightbulb,
    color: 'bg-orange-500'
  }
];

export default function AIToolbar({ selectedText, onTextReplace, onTextInsert, className = '' }: AIToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAIAction = async (action: AIAction) => {
    if (!selectedText.trim()) {
      toast.error('please select some text first');
      return;
    }

    try {
      setIsLoading(true);
      setLoadingAction(action.id);

      let result: string;
      
      switch (action.id) {
        case 'completion':
          result = await frontendAI.completeText(selectedText);
          break;
        case 'formatting':
          result = await frontendAI.formatMarkdown(selectedText);
          break;
        case 'technical-doc':
          result = await frontendAI.improveTechnicalDoc(selectedText);
          break;
        case 'improvement':
          result = await frontendAI.improveText(selectedText);
          break;
        default:
          throw new Error('Unknown action');
      }

      if (result.trim()) {
        if (action.id === 'completion') {
          // for completion, append the result
          onTextInsert(result);
        } else {
          // for other actions, replace the selected text
          onTextReplace(result);
        }
        toast.success(`${action.label} applied successfully!`);
      } else {
        toast.error('no result generated. please try again.');
      }

    } catch (error) {
      console.error(`${action.label} error-`, error);
      toast.error(error instanceof Error ? error.message : `failed to ${action.label.toLowerCase()}`);
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const hasSelectedText = selectedText.trim().length > 0;

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Toggle Button */}
      <Button
        variant={isExpanded ? "default" : "outline"}
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 ${
          isExpanded ? 'bg-gradient-to-r from-primary to-primary/80' : ''
        }`}
        disabled={isLoading}
      >
        <Sparkles className="h-4 w-4" />
        AI Assistant
        {isExpanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </Button>

      {/* AI Actions Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 z-50"
          >
            <Card className="w-80 shadow-lg border-primary/20">
              <CardContent className="p-4">
                {!hasSelectedText ? (
                  <div className="text-center py-4">
                    <Wand2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Select some text to use AI features
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {selectedText.length} characters selected
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        &quot;{selectedText.slice(0, 100)}{selectedText.length > 100 ? '...' : ''}&quot;
                      </p>
                    </div>

                    <div className="space-y-2">
                      {AI_ACTIONS.map((action) => (
                        <motion.div
                          key={action.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-auto p-3 text-left"
                            onClick={() => handleAIAction(action)}
                            disabled={isLoading}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-1.5 rounded-md ${action.color}`}>
                                <action.icon className="h-3 w-3 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">
                                    {action.label}
                                  </span>
                                  {loadingAction === action.id && (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {action.description}
                                </p>
                              </div>
                            </div>
                          </Button>
                        </motion.div>
                      ))}
                    </div>

                    {isLoading && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          processing with AI ...
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
