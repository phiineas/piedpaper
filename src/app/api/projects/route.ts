import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/project';

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ lastUpdated: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('error fetching projects', error);
    return NextResponse.json({ error: 'failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await dbConnect();
    
    const project = new Project({
      name: body.name,
      description: body.description || '',
      content: body.content || '# ' + body.name + '\n\nayoo !',
      createdAt: new Date(),
      lastUpdated: new Date(),
      starred: body.starred || false
    });
    
    const savedProject = await project.save();
    return NextResponse.json(savedProject, { status: 201 });
  } catch (error) {
    console.error('error creating project', error);
    return NextResponse.json({ error: 'failed to create project' }, { status: 500 });
  }
}
