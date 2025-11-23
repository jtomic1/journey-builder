import { FieldInheritanceType } from '../enums/field-inheritance-type';
import { Dependencies, FieldMapping } from './node-dependencies';

export interface GlobalData {
  actionProperties: {
    name: string;
    category: string;
    tenant_id: string;
  };
  clientOrganizationProperties: {
    organization_name: string;
    organization_email: string;
    primary_contact: string;
  };
}

export interface GraphNodeData {
  label: string;
  formFields: string[];
  dependencyData: Dependencies;
  fieldMappings: Record<string, FieldMapping>;
}

export interface DataSection {
  title: string;
  type: FieldInheritanceType;
  options: FieldMapping[];
}
