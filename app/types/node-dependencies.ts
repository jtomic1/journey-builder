export interface NodeDependency {
  id: string;
  name: string;
  formId: string;
  formFields: string[];
}

export interface Dependencies {
  direct: NodeDependency[];
  transitive: NodeDependency[];
}

export interface FieldMapping {
  label: string;
  value: string;
  source: string;
}
