import { FieldInheritanceType } from '../enums/field-inheritance-type';
import { DataSection, GlobalData } from '../types/field-selection';
import { Dependencies, NodeDependency } from '../types/node-dependencies';

export function convertSnakeToTitle(key: string) {
  return key
    .split('_')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.substring(1))
    .join(' ');
}

const globalData: GlobalData = {
  actionProperties: {
    name: 'Test Action',
    category: 'test_category',
    tenant_id: 'tenant_123',
  },
  clientOrganizationProperties: {
    organization_name: 'Test Organisation',
    organization_email: 'test-org@mail.com',
    primary_contact: 'Admin User',
  },
};

export function getDataSections(
  depData: Dependencies,
  allowedDependencies: FieldInheritanceType[] = Object.keys(
    FieldInheritanceType,
  ) as FieldInheritanceType[],
) {
  const sections: DataSection[] = [];
  if (allowedDependencies.includes(FieldInheritanceType.GLOBAL))
    sections.push(...globalDataSections());
  if (allowedDependencies.includes(FieldInheritanceType.DIRECT))
    depData?.direct.forEach((dep) =>
      sections.push(getDependencyDataSection(dep, FieldInheritanceType.DIRECT)),
    );
  if (allowedDependencies.includes(FieldInheritanceType.TRANSITIVE))
    depData?.transitive.forEach((dep) =>
      sections.push(getDependencyDataSection(dep, FieldInheritanceType.TRANSITIVE)),
    );
  return sections;
}

export function globalDataSections(): DataSection[] {
  return [
    {
      title: 'Action Properties',
      type: FieldInheritanceType.GLOBAL,
      options: Object.keys(globalData.actionProperties).map((key) => ({
        label: convertSnakeToTitle(key),
        value: `action.${key}`,
        source: 'Action Properties',
      })),
    },
    {
      title: 'Client Organization Properties',
      type: FieldInheritanceType.GLOBAL,
      options: Object.keys(globalData.clientOrganizationProperties).map((key) => ({
        label: convertSnakeToTitle(key),
        value: `organization.${key}`,
        source: 'Client Organization Properties',
      })),
    },
  ];
}

export function getDependencyDataSection(
  dep: NodeDependency,
  depType: FieldInheritanceType,
): DataSection {
  return {
    title: dep.name,
    type: depType,
    options: dep.formFields.map((field) => ({
      label: field,
      value: `${dep.id}.${field}`,
      source: dep.name,
    })),
  };
}
