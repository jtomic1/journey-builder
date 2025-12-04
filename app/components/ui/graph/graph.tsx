import { Node, ReactFlow, NodeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useRef, useState } from 'react';
import PrefillModal from '../prefill/prefill-modal';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { clearNodeStyles, updateNodeStyle } from '@/app/store/graph-slice';
import { Dependencies } from '@/app/types/node-dependencies';

function Graph() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const nodes = useAppSelector((state) => state.graph.nodes || []);
  const edges = useAppSelector((state) => state.graph.edges || []);

  const onNodeDoubleClick: NodeMouseHandler = (_, node) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  };

  const dispatch = useAppDispatch();

  const onNodeClick: NodeMouseHandler = (_, node) => {
    const deps = node.data.dependencies as Dependencies;
    const nodeStyle = { color: 'red' };
    const coloredNodeIds = [node.id];
    dispatch(updateNodeStyle({ nodeId: node.id, style: { color: 'red' } }));
    deps.direct.forEach((d) => {
      dispatch(updateNodeStyle({ nodeId: d.id, style: nodeStyle }));
      coloredNodeIds.push(d.id);
    });
    deps.transitive.forEach((d) => {
      dispatch(updateNodeStyle({ nodeId: d.id, style: nodeStyle }));
      coloredNodeIds.push(d.id);
    });
    dispatch(clearNodeStyles({ nodesToPreserve: coloredNodeIds }));
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
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
      />
      {selectedNode && isModalOpen && (
        <PrefillModal isVisible={isModalOpen} nodeId={selectedNode.id} onClose={onModalClose} />
      )}
    </div>
  );
}

export default Graph;
