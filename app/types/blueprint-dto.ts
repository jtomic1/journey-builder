export interface ActionBlueprintGraphResponse {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  category: string;
  nodes: NodeDTO[];
  edges: EdgeDTO[];
  forms: FormDTO[];

  // Empty fields
  // branches: any[]
  // triggers: any[]
}

export interface NodeDTO {
  id: string;
  type: string;
  position: Point;
  data: NodeData;
}

export interface NodeData {
  id: string;
  component_key: string;
  component_type: string;
  component_id: string;
  name: string;
  prerequisites: string[];
  sla_duration: SLADuration;
  approval_required: boolean;

  // Empty fields
  // permitted_roles: any[]
  // input_mapping: any
  // approval_roles: any[]
}

export interface EdgeDTO {
  source: string;
  target: string;
}

export interface FormDTO {
  id: string;
  name: string;
  description: string;
  is_reusable: boolean;
  field_schema: Record<string, unknown>;
  ui_schema: Record<string, unknown>;
  dynamic_field_config: Record<string, unknown>;
}

interface Point {
  x: number;
  y: number;
}

interface SLADuration {
  number: number;
  unit: string;
}
