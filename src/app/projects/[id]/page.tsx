'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ProjectPage from '@/components/ProjectPage';

export default function Page() {
  const params = useParams();
  const id = params?.id as string;

  return <ProjectPage id={id} />;
}
