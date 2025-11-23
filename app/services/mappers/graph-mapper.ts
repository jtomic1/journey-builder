import { NodeDTO, FormDTO, EdgeDTO } from '../../types/blueprint-dto';
import { Node as XYNode, Edge as XYEdge, Position, MarkerType } from '@xyflow/react';
import { NodeDependency } from '../../types/node-dependencies';

export class GraphMapper {
  nodes: NodeDTO[];
  edges: EdgeDTO[];
  forms: FormDTO[];

  constructor(nodes: NodeDTO[], edges: EdgeDTO[], forms: FormDTO[]) {
    this.nodes = nodes;
    this.edges = edges;
    this.forms = forms;
  }

  mapDTOToXYNodes(): XYNode[] {
    return this.nodes.map((node) => ({
      id: node.id,
      position: node.position,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: {
        type: node.type,
        formId: node.data.component_id,
        label: node.data.name,
        formFields: this.getFormFields(this.getNodeForm(node)),
        dependencies: {
          direct: this.getDirectDeps(node),
          transitive: this.getTransitiveDeps(node),
        },
      },
    }));
  }

  mapDTOToXYEdges(): XYEdge[] {
    return this.edges.map((edge, index) => ({
      id: `${edge.source}-${edge.target}-${index}`,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      ...edge,
    }));
  }

  private getNodeForm(node: NodeDTO): FormDTO | undefined {
    return this.forms.find((f) => f.id === node.data.component_id);
  }

  private getFormFields(form: FormDTO | undefined): string[] {
    if (!form) return [];
    if (!form.field_schema?.properties) return [];
    return Object.keys(form.field_schema.properties);
  }

  private getDirectDeps(node: NodeDTO): NodeDependency[] {
    const deps = node.data.prerequisites || [];

    return deps
      .map((depId) => {
        const depNode = this.nodes.find((n) => n.id === depId);
        if (!depNode) return null;
        const form = this.forms.find((f) => f.id === depNode.data.component_id);
        return {
          id: depId,
          name: depNode.data.name,
          formId: depNode.data.component_id,
          formFields: this.getFormFields(form),
        };
      })
      .filter(Boolean) as NodeDependency[];
  }

  private getTransitiveDeps(node: NodeDTO): NodeDependency[] {
    const visited = new Set<string>();
    const queue = [...(node.data.prerequisites || [])];
    const transitiveDeps: NodeDependency[] = [];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;

      visited.add(currentId);

      const currentNode = this.nodes.find((n) => n.id === currentId);
      if (!currentNode) continue;

      const form = this.forms.find(
        (f) =>
          f.id === currentNode.data.component_id &&
          !node.data.prerequisites.includes(currentNode.id),
      );

      if (form)
        transitiveDeps.push({
          id: currentNode.id,
          name: currentNode.data.name,
          formId: currentNode.data.component_id,
          formFields: this.getFormFields(form),
        });

      queue.push(...(currentNode.data.prerequisites || []));
    }

    return transitiveDeps;
  }
}
