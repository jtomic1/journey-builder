import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Graph from '../graph/graph';
import { useAppSelector } from '../../../store/store';
import { Node } from '@xyflow/react';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

jest.mock('../../../store/store', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('../prefill/prefill-modal', () => ({
  __esModule: true,
  default: ({ isVisible, nodeId, onClose }: any) =>
    isVisible ? <div>PrefillModal for {nodeId}</div> : null,
}));

describe('Graph component', () => {
  const mockNode: Node = {
    id: 'node1',
    type: 'test',
    position: { x: 0, y: 0 },
    data: {},
  } as any;

  beforeEach(() => {
    (useAppSelector as jest.Mock).mockImplementation((selector: any) =>
      selector({ graph: { nodes: [mockNode], edges: [] } }),
    );
  });

  it('renders ReactFlow container', () => {
    render(<Graph />);
    expect(document.querySelector('.graph-container')).toBeInTheDocument();
  });

  it('opens PrefillModal when a node is clicked', () => {
    render(<Graph />);

    const nodeElement = document.querySelector(`[data-id="${mockNode.id}"]`)!;
    fireEvent.click(nodeElement);

    expect(screen.getByText(/PrefillModal for node1/i)).toBeInTheDocument();
  });

  it('closes PrefillModal when onClose is called', () => {
    render(<Graph />);

    const nodeElement = document.querySelector(`[data-id="${mockNode.id}"]`)!;
    fireEvent.click(nodeElement);

    expect(screen.getByText(/PrefillModal for node1/i)).toBeInTheDocument();
  });
});
