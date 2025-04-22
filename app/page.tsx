'use client';

export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to PiedPaper</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4 border rounded shadow">
          <h2 className="text-2xl font-semibold mb-2">Create a New Project</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">New Project</button>
        </div>
        <div className="p-4 border rounded shadow">
          <h2 className="text-2xl font-semibold mb-2">Recent Activity</h2>
          <ul>
            <li>Edited Markdown Document</li>
            <li>Created a New Project</li>
          </ul>
        </div>
      </div>
    </div>
  );
}