'use client';

import { useQuery } from '@tanstack/react-query';
import { ProgressSpinner } from 'primereact/progressspinner';
import { getActionBlueprintGraph } from './services/api';
import { GraphMapper } from './services/mappers/graph-mapper';
import Graph from './components/ui/graph/graph';
import { useMemo } from 'react';

const TENANT_ID = '123';
const BLUEPRINT_ID = 'bp_456';

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['blueprintGraph'],
    queryFn: () => getActionBlueprintGraph(TENANT_ID, BLUEPRINT_ID),
  });

  const mapper = useMemo(() => {
    return new GraphMapper(data?.nodes || [], data?.edges || [], data?.forms || []);
  }, [data]);

  return (
    <div className='center-align-container'>
      {isLoading ? (
        <ProgressSpinner />
      ) : error ? (
        <span>Error: {error.message}</span>
      ) : (
        <Graph nodes={mapper.mapDTOToXYNodes()} edges={mapper.mapDTOToXYEdges()} />
      )}
    </div>
  );
}
