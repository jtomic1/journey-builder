import { FieldInheritanceType } from '../../enums/field-inheritance-type';
import {
  convertSnakeToTitle,
  getDependencyDataSection,
  globalDataSections,
} from '../field-options-util';

describe('convertSnakeToTitle', () => {
  it('converts snake_case to Title Case', () => {
    expect(convertSnakeToTitle('first_name')).toBe('First Name');
    expect(convertSnakeToTitle('user_id')).toBe('User Id');
  });

  it('works with a single word (no underscores)', () => {
    expect(convertSnakeToTitle('hello')).toBe('Hello');
  });

  it('capitalizes each part correctly', () => {
    expect(convertSnakeToTitle('my_long_test_string')).toBe('My Long Test String');
  });

  it('handles multiple consecutive underscores', () => {
    expect(convertSnakeToTitle('first__name')).toBe('First Name');
  });

  it('handles leading or trailing underscores', () => {
    expect(convertSnakeToTitle('_name')).toBe('Name');
    expect(convertSnakeToTitle('name_')).toBe('Name');
  });

  it('returns an empty string when input is empty', () => {
    expect(convertSnakeToTitle('')).toBe('');
  });
});

describe('globalDataSections', () => {
  it('returns two data sections', () => {
    const result = globalDataSections();
    expect(result).toHaveLength(2);
  });

  it('creates the Action Properties section correctly', () => {
    const result = globalDataSections();
    const section = result[0];

    expect(section.title).toBe('Action Properties');
    expect(section.type).toBe(FieldInheritanceType.GLOBAL);

    expect(section.options).toHaveLength(3);

    expect(section.options[0]).toEqual({
      label: 'Name',
      value: 'action.name',
      source: 'Action Properties',
    });

    expect(section.options[1]).toEqual({
      label: 'Category',
      value: 'action.category',
      source: 'Action Properties',
    });

    expect(section.options[2]).toEqual({
      label: 'Tenant Id',
      value: 'action.tenant_id',
      source: 'Action Properties',
    });
  });

  it('creates the Client Organization Properties section correctly', () => {
    const result = globalDataSections();
    const section = result[1];

    expect(section.title).toBe('Client Organization Properties');
    expect(section.type).toBe(FieldInheritanceType.GLOBAL);

    expect(section.options).toHaveLength(3);

    expect(section.options[0]).toEqual({
      label: 'Organization Name',
      value: 'organization.organization_name',
      source: 'Client Organization Properties',
    });

    expect(section.options[1]).toEqual({
      label: 'Organization Email',
      value: 'organization.organization_email',
      source: 'Client Organization Properties',
    });

    expect(section.options[2]).toEqual({
      label: 'Primary Contact',
      value: 'organization.primary_contact',
      source: 'Client Organization Properties',
    });
  });
});

describe('getDependencyDataSection', () => {
  const dep = {
    id: '123',
    name: 'My Dependency',
    formId: 'form1',
    formFields: ['field1', 'field2'],
  };

  it('creates a correct DataSection', () => {
    const result = getDependencyDataSection(dep, FieldInheritanceType.DIRECT);

    expect(result.title).toBe('My Dependency');
    expect(result.type).toBe(FieldInheritanceType.DIRECT);

    expect(result.options).toHaveLength(2);

    expect(result.options[0]).toEqual({
      label: 'field1',
      value: '123.field1',
      source: 'My Dependency',
    });

    expect(result.options[1]).toEqual({
      label: 'field2',
      value: '123.field2',
      source: 'My Dependency',
    });
  });

  it('works with different inheritance types', () => {
    const result = getDependencyDataSection(dep, FieldInheritanceType.TRANSITIVE);

    expect(result.type).toBe(FieldInheritanceType.TRANSITIVE);
  });

  it('handles empty formFields', () => {
    const emptyDep = { ...dep, formFields: [] };
    const result = getDependencyDataSection(emptyDep, FieldInheritanceType.DIRECT);

    expect(result.options).toHaveLength(0);
  });
});
