import { store } from '../store';
import { setGraph, updateFormFieldMapping, deleteFormFieldMapping } from '../graph-slice';

describe('Redux store integration', () => {
  const sampleNode = {
    id: 'node1',
    data: { fieldMappings: {} },
    position: { x: 0, y: 0 },
    type: 'default',
  };

  beforeEach(() => {
    store.dispatch(setGraph({ nodes: [], edges: [] }));
  });

  it('store returns initial state', () => {
    const state = store.getState();
    expect(state.graph.nodes).toEqual([]);
    expect(state.graph.edges).toEqual([]);
  });

  it('dispatching setGraph updates the store', () => {
    store.dispatch(setGraph({ nodes: [sampleNode] }));
    const state = store.getState();
    expect(state.graph.nodes).toHaveLength(1);
    expect(state.graph.nodes[0].id).toBe('node1');
  });

  it('dispatching updateFormFieldMapping updates a node mapping', () => {
    store.dispatch(setGraph({ nodes: [sampleNode] }));
    store.dispatch(updateFormFieldMapping({ nodeId: 'node1', fieldName: 'f1', mapping: 'v1' }));

    const state = store.getState();
    expect((state.graph.nodes[0].data.fieldMappings as Record<string, any>).f1).toBe('v1');
  });

  it('dispatching deleteFormFieldMapping removes a mapping', () => {
    const nodeWithMapping = { ...sampleNode, data: { fieldMappings: { f1: 'v1' } } };
    store.dispatch(setGraph({ nodes: [nodeWithMapping] }));
    store.dispatch(deleteFormFieldMapping({ nodeId: 'node1', fieldName: 'f1' }));

    const state = store.getState();
    expect((state.graph.nodes[0].data.fieldMappings as Record<string, any>).f1).toBeUndefined();
  });
});
