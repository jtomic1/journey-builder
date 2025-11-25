import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { FieldOptionsModal } from '../field-options-modal/field-options-modal';
import { useAppDispatch } from '../../../store/store';
import { getDataSections } from '../../../utils/field-options-util';
import { Node } from '@xyflow/react';

jest.mock('../../../store/store', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('../../../utils/field-options-util', () => ({
  getDataSections: jest.fn(),
}));

jest.mock('../field-options-modal/field-options-modal.module.scss', () => ({
  selectedOptionContainer: 'selectedOptionContainer',
  optionsContainer: 'optionsContainer',
  option: 'option',
  active: 'active',
}));

describe('FieldOptionsModal', () => {
  const mockDispatch = jest.fn();
  const onClose = jest.fn();
  const node: Node = {
    id: 'node1',
    data: {
      dependencies: {
        direct: [],
        transitive: [],
      },
    },
    position: { x: 0, y: 0 },
    type: 'test',
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('renders modal and displays data sections', () => {
    (getDataSections as jest.Mock).mockReturnValue([
      {
        title: 'Section 1',
        options: [
          { label: 'Option 1', value: 'value1', source: 'source1' },
          { label: 'Option 2', value: 'value2', source: 'source2' },
        ],
      },
    ]);

    render(<FieldOptionsModal isVisible={true} onClose={onClose} node={node} field='field1' />);

    expect(screen.getByText("Available dependency fields for 'field1'")).toBeInTheDocument();

    const accordionHeader = screen.getByText('Section 1');
    fireEvent.click(accordionHeader);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Please select a value to continue.')).toBeInTheDocument();
  });

  it('selects an option and enables save button', () => {
    const option = { label: 'Option 1', value: 'value1', source: 'source1' };
    (getDataSections as jest.Mock).mockReturnValue([{ title: 'Section 1', options: [option] }]);

    render(<FieldOptionsModal isVisible={true} onClose={onClose} node={node} field='field1' />);

    const accordionHeader = screen.getByText('Section 1');
    fireEvent.click(accordionHeader);

    const optionDiv = screen.getByText('Option 1');
    fireEvent.click(optionDiv);

    expect(screen.getByText(/Selected value:/)).toBeInTheDocument();
    const saveButton = screen.getByText('Save').closest('button')!;
    expect(saveButton).not.toBeDisabled();

    fireEvent.click(saveButton);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'graph/updateFormFieldMapping',
      payload: { nodeId: 'node1', fieldName: 'field1', mapping: option },
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', () => {
    (getDataSections as jest.Mock).mockReturnValue([]);

    render(<FieldOptionsModal isVisible={true} onClose={onClose} node={node} field='field1' />);

    const cancelButton = screen.getByText('Cancel').closest('button')!;
    fireEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });
});
