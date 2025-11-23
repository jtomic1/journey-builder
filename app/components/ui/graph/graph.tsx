import { Node, Edge, ReactFlow, NodeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export type GraphProps = {
  nodes: Node[];
  edges: Edge[];
};

function Graph({ nodes, edges }: GraphProps) {
  const onNodeClick: NodeMouseHandler = (_, node) => {
    console.log(node);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        className='graph-container'
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        fitView
      />
    </div>
  );
}

export default Graph;
