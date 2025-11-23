'use client';

import { useQuery } from '@tanstack/react-query';
import { getActionBlueprintGraph } from './services/api';

const TENANT_ID = '123';
const BLUEPRINT_ID = 'bp_456';

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['blueprintGraph'],
    queryFn: () => getActionBlueprintGraph(TENANT_ID, BLUEPRINT_ID),
  });

  if (isLoading) return <div>Loading...</div>;
  else if (error) return <div>Error: {error.message}</div>;
  else return <div>Data fetched successfully!</div>;
}
