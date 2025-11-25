import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import PrefillModal from '../prefill/prefill-modal';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { deleteFormFieldMapping } from '../../../store/graph-slice';

jest.mock('../../../store/store', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('../prefill-field/prefill-field', () => ({
  __esModule: true,
  default: ({ field, onDeleteClick, onFieldClick }: any) => (
    <div data-testid={`prefill-field-${field}`}>
      <span onClick={onFieldClick}>{field}</span>
      <button onClick={onDeleteClick}>Delete</button>
    </div>
  ),
}));

jest.mock('../field-options-modal/field-options-modal', () => ({
  __esModule: true,
  FieldOptionsModal: ({ isVisible, field }: any) =>
    isVisible ? <div data-testid='field-options-modal'>{field}</div> : null,
}));

jest.mock('../prefill/prefill-modal.module.scss', () => ({
  formFieldContainer: 'formFieldContainer',
}));

describe('PrefillModal', () => {
  const mockDispatch = jest.fn();
  const onClose = jest.fn();
  const nodeId = 'node1';
  const node = {
    id: nodeId,
    data: {
      label: 'Test Node',
      formFields: ['field1', 'field2'],
      fieldMappings: {
        field1: { label: 'Label1', value: 'Value1', source: 'Source1' },
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockImplementation((selector: any) =>
      selector({ graph: { nodes: [node] } }),
    );
  });

  it('renders modal and prefill fields', () => {
    render(<PrefillModal isVisible={true} onClose={onClose} nodeId={nodeId} />);

    expect(screen.getByText('Test Node')).toBeInTheDocument();
    expect(screen.getByTestId('prefill-field-field1')).toBeInTheDocument();
    expect(screen.getByTestId('prefill-field-field2')).toBeInTheDocument();
  });

  it('shows error when node not found', () => {
    (useAppSelector as jest.Mock).mockImplementation((selector: any) =>
      selector({ graph: { nodes: [] } }),
    );

    render(<PrefillModal isVisible={true} onClose={onClose} nodeId='unknown' />);
    expect(screen.getByText('Error loading node...')).toBeInTheDocument();
  });

  it('opens FieldOptionsModal when a field is clicked', () => {
    render(<PrefillModal isVisible={true} onClose={onClose} nodeId={nodeId} />);

    const fieldDiv = screen.getByText('field2');
    fireEvent.click(fieldDiv);

    expect(screen.getByTestId('field-options-modal')).toHaveTextContent('field2');
  });

  it('dispatches deleteFormFieldMapping when delete button clicked', () => {
    render(<PrefillModal isVisible={true} onClose={onClose} nodeId={nodeId} />);

    const deleteButton = screen.getByTestId('prefill-field-field1').querySelector('button')!;
    fireEvent.click(deleteButton);

    expect(mockDispatch).toHaveBeenCalledWith(
      deleteFormFieldMapping({ nodeId, fieldName: 'field1' }),
    );
  });

  it('closes FieldOptionsModal when onClose is called', () => {
    render(<PrefillModal isVisible={true} onClose={onClose} nodeId={nodeId} />);

    fireEvent.click(screen.getByText('field2'));
    expect(screen.getByTestId('field-options-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('field-options-modal'));
  });
});
