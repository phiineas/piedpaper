import { create } from 'zustand';

interface MarkdownState {
  documents: {
    id: string;
    title: string;
    content: string;
    updatedAt: Date;
  }[];
  currentDocument: string | null;
  setCurrentDocument: (id: string | null) => void;
  addDocument: (title: string, content: string) => void;
  updateDocument: (id: string, content: string) => void;
}

export const useMarkdownStore = create<MarkdownState>((set) => ({
  documents: [],
  currentDocument: null,
  setCurrentDocument: (id) => set({ currentDocument: id }),
  addDocument: (title, content) => 
    set((state) => ({
      documents: [
        ...state.documents,
        {
          id: Date.now().toString(),
          title,
          content,
          updatedAt: new Date(),
        },
      ],
    })),
  updateDocument: (id, content) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id
          ? { ...doc, content, updatedAt: new Date() }
          : doc
      ),
    })),
}));