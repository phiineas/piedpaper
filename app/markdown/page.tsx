'use client';

import MarkdownEditor from '../../components/markdowneditor';

export default function MarkdownPage() {
    const handleSave = async (content: string) => {
    // save to database using Prisma
    console.log('Saving markdown:', content);
    // API call:
    // await fetch('/api/documents', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ content }),
    // });
  };
  
    return (
        <div className="container mx-auto py-8">
        <MarkdownEditor onSave={handleSave} />
        </div>
    );
}