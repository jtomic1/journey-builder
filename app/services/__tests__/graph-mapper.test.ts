import { GraphMapper } from '../mappers/graph-mapper';
import { NodeDTO, EdgeDTO, FormDTO } from '../../types/blueprint-dto';
import { Node as XYNode, Edge as XYEdge, Position, MarkerType } from '@xyflow/react';
import { Dependencies } from '@/app/types/node-dependencies';

describe('GraphMapper', () => {
  const forms: FormDTO[] = [
    {
      id: 'form1',
      name: 'Form 1',
      description: 'desc',
      is_reusable: true,
      field_schema: { properties: { fieldA: {}, fieldB: {} } },
      ui_schema: {},
      dynamic_field_config: {},
    },
    {
      id: 'form2',
      name: 'Form 2',
      description: 'desc2',
      is_reusable: false,
      field_schema: { properties: { fieldX: {} } },
      ui_schema: {},
      dynamic_field_config: {},
    },
  ];

  const nodes: NodeDTO[] = [
    {
      id: 'node1',
      type: 'task',
      position: { x: 0, y: 0 },
      data: {
        id: 'node1',
        component_key: 'comp1',
        component_type: 'type1',
        component_id: 'form1',
        name: 'Node 1',
        prerequisites: [],
        sla_duration: { number: 1, unit: 'hours' },
        approval_required: false,
      },
    },
    {
      id: 'node2',
      type: 'task',
      position: { x: 100, y: 100 },
      data: {
        id: 'node2',
        component_key: 'comp2',
        component_type: 'type2',
        component_id: 'form2',
        name: 'Node 2',
        prerequisites: ['node1'],
        sla_duration: { number: 2, unit: 'days' },
        approval_required: true,
      },
    },
  ];

  const edges: EdgeDTO[] = [{ source: 'node1', target: 'node2' }];

  let mapper: GraphMapper;

  beforeEach(() => {
    mapper = new GraphMapper(nodes, edges, forms);
  });

  it('maps nodes correctly to XYNodes', () => {
    const xyNodes: XYNode[] = mapper.mapDTOToXYNodes();

    expect(xyNodes).toHaveLength(2);

    const node1Mapped = xyNodes.find((n) => n.id === 'node1')!;
    expect(node1Mapped.position).toEqual({ x: 0, y: 0 });
    expect(node1Mapped.sourcePosition).toBe(Position.Right);
    expect(node1Mapped.targetPosition).toBe(Position.Left);
    expect(node1Mapped.data.label).toBe('Node 1');
    expect(node1Mapped.data.formId).toBe('form1');
    expect(node1Mapped.data.formFields).toEqual(['fieldA', 'fieldB']);

    expect((node1Mapped.data.dependencies as Dependencies).direct).toEqual([]);
    expect((node1Mapped.data.dependencies as Dependencies).transitive).toEqual([]);

    const node2Mapped = xyNodes.find((n) => n.id === 'node2')!;
    expect((node2Mapped.data.dependencies as Dependencies).direct).toEqual([
      {
        id: 'node1',
        name: 'Node 1',
        formId: 'form1',
        formFields: ['fieldA', 'fieldB'],
      },
    ]);
  });

  it('maps edges correctly to XYEdges', () => {
    const xyEdges: XYEdge[] = mapper.mapDTOToXYEdges();

    expect(xyEdges).toHaveLength(1);
    expect(xyEdges[0]).toMatchObject({
      id: 'node1-node2-0',
      source: 'node1',
      target: 'node2',
      markerEnd: { type: MarkerType.ArrowClosed },
    });
  });

  it('handles missing form gracefully', () => {
    const nodesWithMissingForm: NodeDTO[] = [
      {
        id: 'node3',
        type: 'task',
        position: { x: 0, y: 0 },
        data: {
          id: 'node3',
          component_key: 'comp3',
          component_type: 'type3',
          component_id: 'nonexistent',
          name: 'Node 3',
          prerequisites: [],
          sla_duration: { number: 1, unit: 'hours' },
          approval_required: false,
        },
      },
    ];

    const mapper2 = new GraphMapper(nodesWithMissingForm, [], forms);
    const xyNodes = mapper2.mapDTOToXYNodes();
    expect(xyNodes[0].data.formFields).toEqual([]);
  });

  it('computes transitive dependencies correctly', () => {
    const xyNodes = mapper.mapDTOToXYNodes();
    const node2Deps = xyNodes.find((n) => n.id === 'node2')!.data.dependencies;

    expect((node2Deps as Dependencies).transitive).toEqual([]);

    const node3: NodeDTO = {
      id: 'node3',
      type: 'task',
      position: { x: 200, y: 200 },
      data: {
        id: 'node3',
        component_key: 'comp3',
        component_type: 'type3',
        component_id: 'form1',
        name: 'Node 3',
        prerequisites: ['node2'],
        sla_duration: { number: 1, unit: 'days' },
        approval_required: false,
      },
    };

    const mapper3 = new GraphMapper([...nodes, node3], edges, forms);
    const xyNodes3 = mapper3.mapDTOToXYNodes();
    const node3Deps = xyNodes3.find((n) => n.id === 'node3')!.data.dependencies;

    expect((node3Deps as Dependencies).direct).toEqual([
      {
        id: 'node2',
        name: 'Node 2',
        formId: 'form2',
        formFields: ['fieldX'],
      },
    ]);

    expect((node3Deps as Dependencies).transitive).toEqual([
      {
        id: 'node1',
        name: 'Node 1',
        formId: 'form1',
        formFields: ['fieldA', 'fieldB'],
      },
    ]);
  });
});
