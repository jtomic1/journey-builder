import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Edge, Node } from '@xyflow/react';

export type GraphState = {
  nodes: Node[];
  edges: Edge[];
};

interface UpdateMappingPayload {
  nodeId: string;
  fieldName: string;
  mapping: any;
}

interface DeleteMappingPayload {
  nodeId: string;
  fieldName: string;
}

const INITIAL_STATE: GraphState = {
  nodes: [],
  edges: [],
};

export const GraphSlice = createSlice({
  name: 'graph',
  initialState: INITIAL_STATE,
  reducers: {
    setGraph: (state, action: PayloadAction<Partial<GraphState>>) => {
      return { ...state, ...action.payload };
    },
    updateFormFieldMapping: (state, action: PayloadAction<UpdateMappingPayload>) => {
      const { nodeId, fieldName, mapping } = action.payload;
      const node = state.nodes.find((n) => n.id === nodeId);
      if (node) {
        node.data.fieldMappings = {
          ...(node.data.fieldMappings || {}),
          [fieldName]: mapping,
        };
      }
    },
    deleteFormFieldMapping: (state, action: PayloadAction<DeleteMappingPayload>) => {
      const { nodeId, fieldName } = action.payload;
      const node = state.nodes.find((n) => n.id === nodeId);
      if (node && node.data.fieldMappings)
        delete (node.data.fieldMappings as Record<string, any>)[fieldName];
    },
  },
});

export const { setGraph, updateFormFieldMapping, deleteFormFieldMapping } = GraphSlice.actions;

export default GraphSlice.reducer;
