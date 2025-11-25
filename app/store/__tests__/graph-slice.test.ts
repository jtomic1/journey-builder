import GraphReducer, {
  setGraph,
  updateFormFieldMapping,
  deleteFormFieldMapping,
  GraphState,
} from '../graph-slice';

describe('GraphSlice reducers', () => {
  const initialState: GraphState = { nodes: [], edges: [] };

  const sampleNode = {
    id: 'node1',
    data: {
      fieldMappings: {},
    },
    position: { x: 0, y: 0 },
    type: 'default',
  };

  it('should return initial state when called with undefined', () => {
    expect(GraphReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('setGraph merges new state correctly', () => {
    const action = setGraph({ nodes: [sampleNode] });
    const newState = GraphReducer(initialState, action);
    expect(newState.nodes).toHaveLength(1);
    expect(newState.nodes[0].id).toBe('node1');
    expect(newState.edges).toHaveLength(0);
  });

  it('updateFormFieldMapping adds mapping to node', () => {
    const stateWithNode: GraphState = { nodes: [sampleNode], edges: [] };
    const action = updateFormFieldMapping({
      nodeId: 'node1',
      fieldName: 'field1',
      mapping: 'value1',
    });
    const newState = GraphReducer(stateWithNode, action);

    expect((newState.nodes[0].data.fieldMappings as Record<string, any>).field1).toBe('value1');
  });

  it('deleteFormFieldMapping removes mapping from node', () => {
    const stateWithMapping: GraphState = {
      nodes: [
        {
          ...sampleNode,
          data: { fieldMappings: { field1: 'value1', field2: 'value2' } },
        },
      ],
      edges: [],
    };

    const action = deleteFormFieldMapping({ nodeId: 'node1', fieldName: 'field1' });
    const newState = GraphReducer(stateWithMapping, action);

    expect((newState.nodes[0].data.fieldMappings as Record<string, any>).field1).toBeUndefined();
    expect((newState.nodes[0].data.fieldMappings as Record<string, any>).field2).toBe('value2'); // still there
  });

  it('update/delete ignore non-existent nodes safely', () => {
    const action1 = updateFormFieldMapping({ nodeId: 'nonexistent', fieldName: 'x', mapping: 1 });
    const action2 = deleteFormFieldMapping({ nodeId: 'nonexistent', fieldName: 'x' });

    let state = GraphReducer(initialState, action1);
    state = GraphReducer(state, action2);

    expect(state).toEqual(initialState);
  });
});
