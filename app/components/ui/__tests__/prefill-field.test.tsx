import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import PrefillField from '../prefill-field/prefill-field';
import { FieldMapping } from '@/app/types/node-dependencies';

jest.mock('../prefill-field/prefill-field.module.scss', () => ({
  noPrefilledField: 'noPrefilledField',
  prefilledField: 'prefilledField',
}));

describe('PrefillField', () => {
  it('renders mappedValue when provided', () => {
    const mappedValue: FieldMapping = {
      label: 'Label1',
      value: 'Value1',
      source: 'Source1',
    };
    const onDeleteClick = jest.fn();
    const onFieldClick = jest.fn();

    const { container } = render(
      <PrefillField
        field='TestField'
        mappedValue={mappedValue}
        onDeleteClick={onDeleteClick}
        onFieldClick={onFieldClick}
      />,
    );

    expect(screen.getByText('TestField: Source1.Label1')).toBeInTheDocument();

    const deleteIcon = container.querySelector('.pi-times-circle')!;
    fireEvent.click(deleteIcon);
    expect(onDeleteClick).toHaveBeenCalled();
  });

  it('renders field without mappedValue', () => {
    const onDeleteClick = jest.fn();
    const onFieldClick = jest.fn();

    const { container } = render(
      <PrefillField
        field='TestField'
        mappedValue={undefined}
        onDeleteClick={onDeleteClick}
        onFieldClick={onFieldClick}
      />,
    );

    expect(screen.getByText('TestField')).toBeInTheDocument();
    const clickableDiv = container.querySelector('.noPrefilledField')!;
    fireEvent.click(clickableDiv);
    expect(onFieldClick).toHaveBeenCalled();
  });
});
