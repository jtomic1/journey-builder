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

interface UpdateNodeStyle {
  nodeId: string;
  style: any;
}

interface ClearNodeStyles {
  nodesToPreserve: string[];
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
    updateNodeStyle: (state, action: PayloadAction<UpdateNodeStyle>) => {
      const { nodeId, style } = action.payload;
      state.nodes.forEach((n) => {
        if (nodeId === n.id) n.style = style;
        state.edges.forEach((e) => {
          if (e.target === nodeId) e.style = { stroke: 'red', width: '2px' };
        });
      });
    },
    clearNodeStyles: (state, action: PayloadAction<ClearNodeStyles>) => {
      const toPreserve = action.payload.nodesToPreserve;
      state.nodes.forEach((n) => {
        if (!toPreserve.includes(n.id)) delete n.style;
      });
      state.edges.forEach((e) => {
        if (!toPreserve.includes(e.target)) delete e.style;
      });
    },
    deleteFormFieldMapping: (state, action: PayloadAction<DeleteMappingPayload>) => {
      const { nodeId, fieldName } = action.payload;
      const node = state.nodes.find((n) => n.id === nodeId);
      if (node && node.data.fieldMappings)
        delete (node.data.fieldMappings as Record<string, any>)[fieldName];
    },
  },
});

export const {
  setGraph,
  updateFormFieldMapping,
  deleteFormFieldMapping,
  updateNodeStyle,
  clearNodeStyles,
} = GraphSlice.actions;

export default GraphSlice.reducer;
