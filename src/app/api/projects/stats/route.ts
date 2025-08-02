import { NextResponse } from 'next/server';
import { db } from '@/models/drizzle';
import { projects } from '@/lib/schema';
import { eq, count } from 'drizzle-orm';
import { auth } from '@/lib/auth';

const MAX_PROJECTS_PER_USER = 6;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    // get current project count for the user
    const userProjectCount = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.userId, session.user.id));

    const currentCount = userProjectCount[0]?.count || 0;
    const remainingProjects = Math.max(0, MAX_PROJECTS_PER_USER - currentCount);
    const canCreateMore = currentCount < MAX_PROJECTS_PER_USER;

    return NextResponse.json({
      currentCount,
      maxProjects: MAX_PROJECTS_PER_USER,
      remainingProjects,
      canCreateMore,
      isAtLimit: currentCount >= MAX_PROJECTS_PER_USER
    });
  } catch (error) {
    console.error('error fetching project stats', error);
    return NextResponse.json({ error: 'failed to fetch project stats' }, { status: 500 });
  }
}
