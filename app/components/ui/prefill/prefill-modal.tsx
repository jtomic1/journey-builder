import { Dialog } from 'primereact/dialog';
import styles from './prefill-modal.module.scss';
import { useState } from 'react';
import { FieldOptionsModal } from '../field-options-modal/field-options-modal';
import { FieldMapping } from '../../../types/node-dependencies';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { deleteFormFieldMapping } from '../../../store/graph-slice';
import PrefillField from '../prefill-field/prefill-field';

interface PrefillModalProps {
  isVisible: boolean;
  onClose: () => void;
  nodeId: string;
}

export default function PrefillModal({ isVisible, onClose, nodeId }: PrefillModalProps) {
  const dispatch = useAppDispatch();

  const [showSelectedField, setShowSelectedField] = useState<boolean>(false);
  const [selectedField, setSelectedField] = useState<string>('');

  const node = useAppSelector((state) => state.graph.nodes.find((n) => n.id === nodeId));

  const onFieldClick = (field: string) => {
    setShowSelectedField(true);
    setSelectedField(field);
  };

  const onDeleteClick = (nodeId: string, fieldName: string) => {
    dispatch(
      deleteFormFieldMapping({
        nodeId,
        fieldName,
      }),
    );
  };

  const onSelectedFieldClose = () => {
    setShowSelectedField(false);
    setSelectedField('');
  };

  if (!node) return <div>Error loading node...</div>;

  const formFields = Array.isArray(node.data?.formFields) ? (node.data.formFields as string[]) : [];
  const fieldMappings = (node.data?.fieldMappings as Record<string, FieldMapping>) || {};
  const hasFields = formFields.length > 0;

  return (
    <>
      <Dialog
        header={node.data?.label as string}
        onHide={onClose}
        visible={isVisible}
        style={{ width: '50vw' }}
      >
        <div className={styles.formFieldContainer}>
          {hasFields ? (
            formFields.map((field) => {
              const mappedValue = fieldMappings[field];

              const fieldProps = {
                mappedValue,
                field,
                onDeleteClick: () => onDeleteClick(node.id, field),
                onFieldClick: () => onFieldClick(field),
              };

              return <PrefillField key={field} {...fieldProps} />;
            })
          ) : (
            <div>No fields found for prefill!</div>
          )}
        </div>
      </Dialog>
      {showSelectedField && selectedField && (
        <FieldOptionsModal
          isVisible={showSelectedField}
          onClose={onSelectedFieldClose}
          field={selectedField}
          node={node}
        />
      )}
    </>
  );
}
