'use client';

import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'; 

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { 
  Bold, Italic, Code, Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, Link, Image, Table, 
  AlignLeft, Pilcrow, Strikethrough
} from 'lucide-react';

// initial markdown content
export const initialMarkdown = `# **Welcome to Pied Paper Markdown Editor!**

## The Algorithm
> "Middle-out compression is the future!" - Richard Hendricks

\`\`\`javascript
// The revolutionary middle-out compression algorithm
function middleOutCompression(input) {
  return input.split('').reverse().join(''); // Just kidding, it's proprietary!
}
\`\`\`

## Team Members
- **Richard Hendricks** - The visionary CEO
- **Bertram Gilfoyle** - The paranoid systems architect
- **Dinesh Chugtai** - The sarcastic coder
- **Jared Dunn** - The overly supportive COO
- **Erlich Bachman** - The self-proclaimed incubator genius

## Fun Facts
- **Pied Paper** is not just a company, it's a lifestyle.
- The compression rate is so good, even Gilfoyle smiles (sometimes).

## How to Use
1. Write your markdown on the left.
2. Watch the magic happen on the right.
3. Profit! (Or at least try to.)

[Visit Pied Piper](https://www.piedpaper.com)

![Pied Piper Logo](https://via.placeholder.com/150)

| Feature         | Status     |
|-----------------|------------|
| Compression     | ✅ Working |
| Decentralization| 🚧 In Progress |
| Funding         | 💸 Always Needed |

~~Hooli sucks~~
`;

interface MarkdownEditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

export default function MarkdownEditor({ initialContent, onContentChange }: MarkdownEditorProps) {
  const [markdown, setMarkdown] = useState(initialContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // update internal state if initialContent prop changes
  useEffect(() => {
    console.log("initialContent changed-", initialContent);
    setMarkdown(initialContent);
  }, [initialContent]);

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
    onContentChange(newMarkdown); // call the callback prop
  };

  // function to apply markdown syntax
  const applyMarkdownSyntax = (syntaxStart: string, syntaxEnd: string = syntaxStart) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const textBefore = textarea.value.substring(0, start);
    const textAfter = textarea.value.substring(end);

    // if text is selected, wrap it
    if (selectedText) {
      const newText = `${textBefore}${syntaxStart}${selectedText}${syntaxEnd}${textAfter}`;
      handleMarkdownChange(newText);
      // restore selection after state update
      requestAnimationFrame(() => {
        textarea.selectionStart = start + syntaxStart.length;
        textarea.selectionEnd = end + syntaxStart.length;
        textarea.focus();
      });
    } else {
      const newText = `${textBefore}${syntaxStart}${syntaxEnd}${textAfter}`;
      handleMarkdownChange(newText);
      // place cursor in the middle after state update
      requestAnimationFrame(() => {
        textarea.selectionStart = start + syntaxStart.length;
        textarea.selectionEnd = start + syntaxStart.length;
        textarea.focus();
      });
    }
  };

  // insert special blocks
  const insertBlock = (blockType: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, start);
    const textAfter = textarea.value.substring(start);
    
    let insertText = '';
    
    switch (blockType) {
      case 'h1':
        insertText = '# Heading 1';
        break;
      case 'h2':
        insertText = '## Heading 2';
        break;
      case 'h3':
        insertText = '### Heading 3';
        break;
      case 'ul':
        insertText = '- List item';
        break;
      case 'ol':
        insertText = '1. List item';
        break;
      case 'blockquote':
        insertText = '> Blockquote';
        break;
      case 'code':
        insertText = '```\nCode block\n```';
        break;
      case 'link':
        insertText = '[Link text](https://example.com)';
        break;
      case 'image':
        insertText = '![Alt text](https://via.placeholder.com/150)';
        break;
      case 'table':
        insertText = '| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |';
        break;
      case 'linebreak':
        insertText = '<br/>';
        break;
      case 'paragraph':
        insertText = '\n\n';
        break;
    }
    
    // add a newline before the block if not at the beginning of a line
    const needsNewline = textBefore.length > 0 && !textBefore.endsWith('\n');
    const newText = `${textBefore}${needsNewline ? '\n' : ''}${insertText}${textAfter}`;
    
    handleMarkdownChange(newText); 
    
    // set cursor position after the inserted block
    const newPosition = start + insertText.length + (needsNewline ? 1 : 0);
    requestAnimationFrame(() => {
      textarea.selectionStart = newPosition;
      textarea.selectionEnd = newPosition;
      textarea.focus();
    });
  };

  // handle keydown events for shortcuts
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const isCtrlOrCmd = event.ctrlKey || event.metaKey; 

    if (isCtrlOrCmd) {
      switch (event.key.toLowerCase()) {
        case 'b': // bold (Ctrl+B / Cmd+B)
          event.preventDefault();
          applyMarkdownSyntax('**');
          break;
        case 'i': // italic (Ctrl+I / Cmd+I)
          event.preventDefault(); 
          applyMarkdownSyntax('*');
          break;
        case '`': // inline Code (Ctrl+` / Cmd+`) 
          event.preventDefault();
          applyMarkdownSyntax('`');
          break;
      }
    }
  };

  // custom styles for the rendered markdown
  const markdownStyles = `
    .markdown-preview {
      line-height: 1.5;
    }
    .markdown-preview h1, .markdown-preview h2, .markdown-preview h3 {
      margin-top: 1.5em;
      margin-bottom: 0.75em;
      line-height: 1.2;
    }
    .markdown-preview h1 {
      font-size: 2em;
    }
    .markdown-preview h2 {
      font-size: 1.5em;
    }
    .markdown-preview h3 {
      font-size: 1.25em;
    }
    .markdown-preview p {
      margin-bottom: 1em;
    }
    .markdown-preview br + br,
    .markdown-preview p + p {
      margin-top: 1em;
    }
    .markdown-preview ul, .markdown-preview ol {
      margin-bottom: 1em;
      padding-left: 2em;
      list-style-position: outside;
    }
    .markdown-preview ul {
      list-style-type: disc;
    }
    .markdown-preview ol {
      list-style-type: decimal;
    }
    .markdown-preview ul ul, 
    .markdown-preview ol ol,
    .markdown-preview ul ol,
    .markdown-preview ol ul {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
    .markdown-preview ul li,
    .markdown-preview ol li {
      margin-bottom: 0.25em;
    }
    .markdown-preview blockquote {
      border-left: 3px solid #d1d5db;
      padding-left: 1em;
      margin-left: 0;
      margin-right: 0;
      color: #6b7280;
      margin-bottom: 1em;
    }
    .markdown-preview pre {
      background: #f3f4f6;
      padding: 1em;
      border-radius: 0.375rem;
      overflow-x: auto;
      margin-bottom: 1em;
    }
    .markdown-preview code {
      background: #f3f4f6;
      padding: 0.2em 0.4em;
      border-radius: 0.25rem;
      font-size: 0.875em;
      font-family: monospace;
    }
    .markdown-preview pre code {
      background: transparent;
      padding: 0;
      border-radius: 0;
      font-size: 0.9em;
    }
    .markdown-preview img {
      max-width: 100%;
      height: auto;
      margin-bottom: 1em;
    }
    .markdown-preview table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 1em;
    }
    .markdown-preview th, .markdown-preview td {
      border: 1px solid #d1d5db;
      padding: 0.5em;
      text-align: left;
    }
    .markdown-preview th {
      background-color: #f3f4f6;
      font-weight: bold;
    }
    .dark .markdown-preview pre,
    .dark .markdown-preview code {
      background: #1f2937;
    }
    .dark .markdown-preview blockquote {
      border-color: #4b5563;
      color: #9ca3af;
    }
    .dark .markdown-preview th {
      background-color: #374151;
    }
    .dark .markdown-preview th, 
    .dark .markdown-preview td {
      border-color: #4b5563;
    }
    .markdown-preview a {
      color: #2563eb;
      text-decoration: underline;
    }
    .dark .markdown-preview a {
      color: #60a5fa;
    }
  `;

  return (
    <>
      <style>{markdownStyles}</style>
      <div className="flex flex-col h-[calc(100vh-theme_header_height)] max-w-6xl mx-auto px-4">
        <div className="bg-card rounded-lg shadow-sm p-2 my-4 flex flex-wrap gap-2 sticky top-0 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => applyMarkdownSyntax('**')}>
                  <Bold size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bold (Ctrl+B)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => applyMarkdownSyntax('*')}>
                  <Italic size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Italic (Ctrl+I)</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => applyMarkdownSyntax('`')}>
                  <Code size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Inline Code (Ctrl+`)</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-8" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => insertBlock('h1')}>
                  <Heading1 size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 1</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => insertBlock('h2')}>
                  <Heading2 size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 2</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => insertBlock('h3')}>
                  <Heading3 size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 3</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-8" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => insertBlock('ul')}>
                  <List size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bullet List</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => insertBlock('ol')}>
                  <ListOrdered size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Numbered List</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => insertBlock('blockquote')}>
                  <Quote size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Blockquote</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-8" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => insertBlock('link')}>
                  <Link size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Link</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => insertBlock('image')}>
                  <Image size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Image</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => insertBlock('code')}>
                  <AlignLeft size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Code Block</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => insertBlock('table')}>
                  <Table size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Table</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-8" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => applyMarkdownSyntax('~~')}>
                  <Strikethrough size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Strikethrough</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => insertBlock('linebreak')}>
                  <Pilcrow size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Line Break</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => insertBlock('paragraph')}>
                  <AlignLeft size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Paragraph Break</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex flex-col md:flex-row flex-1 gap-4 pb-4">
          <Card className="w-full md:w-1/2 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Markdown</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <Textarea
                ref={textareaRef}
                className="w-full h-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-base font-mono"
                value={markdown}
                onChange={(e) => handleMarkdownChange(e.target.value)} 
                onKeyDown={handleKeyDown}
                placeholder="ayoo!"
              />
            </CardContent>
          </Card>

          <Card className="w-full md:w-1/2 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-grow overflow-auto">
              <div className="prose dark:prose-invert max-w-none markdown-preview">
                {/* the key prop forces re-render when markdown changes */}
                <ReactMarkdown 
                  key={markdown}
                  remarkPlugins={[remarkGfm]} 
                  rehypePlugins={[rehypeRaw]}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
