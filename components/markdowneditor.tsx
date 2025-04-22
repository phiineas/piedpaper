import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { format } from 'date-fns';

interface MarkdownEditorProps {
  initialValue?: string;
  onSave?: (content: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialValue = '# Hello, world!',
  onSave
}) => {
  const [content, setContent] = useState(initialValue);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const handleSave = () => {
    if (onSave) {
      onSave(content);
      setLastSaved(format(new Date(), 'PPpp'));
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Markdown Editor</h1>
        <div className="flex gap-2">
          {lastSaved && <span className="text-sm text-gray-500">Last saved: {lastSaved}</span>}
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
      
      <MDEditor
        value={content}
        onChange={(val) => setContent(val || '')}
        height={500}
      />
      
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Preview</h2>
        <MDEditor.Markdown source={content} style={{ padding: 16 }} />
      </div>
    </div>
  );
};

export default MarkdownEditor;