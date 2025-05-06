import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/project';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const project = await Project.findById(params.id);
    
    if (!project) {
      return NextResponse.json({ error: 'project not found' }, { status: 404 });
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    await dbConnect();
    
    const updatedProject = await Project.findByIdAndUpdate(
      params.id,
      { 
        ...body,
        lastUpdated: new Date() 
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedProject) {
      return NextResponse.json({ error: 'project not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('error updating project-', error);
    return NextResponse.json({ error: 'failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const deletedProject = await Project.findByIdAndDelete(params.id);
    
    if (!deletedProject) {
      return NextResponse.json({ error: 'project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'project deleted successfully' });
  } catch (error) {
    console.error('error deleting project-', error);
    return NextResponse.json({ error: 'failed to delete project' }, { status: 500 });
  }
}
