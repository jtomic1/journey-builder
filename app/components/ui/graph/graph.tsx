import { Node, ReactFlow, NodeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState } from 'react';
import PrefillModal from '../prefill/prefill-modal';
import { useAppSelector } from '../../../store/store';

function Graph() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const nodes = useAppSelector((state) => state.graph.nodes || []);
  const edges = useAppSelector((state) => state.graph.edges || []);

  const onNodeClick: NodeMouseHandler = (_, node) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  };

  const onModalClose = () => {
    setIsModalOpen(false);
    setSelectedNode(null);
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
      {selectedNode && isModalOpen && (
        <PrefillModal isVisible={isModalOpen} nodeId={selectedNode.id} onClose={onModalClose} />
      )}
    </div>
  );
}

export default Graph;
