import { Dialog } from 'primereact/dialog';
import styles from './prefill-modal.module.scss';
import { useState } from 'react';
import { FieldOptionsModal } from '../field-options-modal/field-options-modal';
import { FieldMapping } from '@/app/types/node-dependencies';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { deleteFormFieldMapping } from '@/app/store/graph-slice';

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

  return (
    <>
      <Dialog
        header={node.data.label as string}
        onHide={onClose}
        visible={isVisible}
        style={{ width: '50vw' }}
      >
        <div className={styles.formFieldContainer}>
          {(node.data.formFields as string[]) &&
            (node.data.formFields as string[]).map((field: string) => {
              const mappedValue = ((node.data.fieldMappings as Record<string, FieldMapping>) || {})[
                field
              ];
              if (mappedValue) {
                return (
                  <div key={field} className={styles.prefilledField}>
                    <div>{`${field}: ${mappedValue.source}.${mappedValue.label}`}</div>
                    <i
                      className='pi pi-times-circle'
                      onClick={() => onDeleteClick(node.id, field)}
                    ></i>
                  </div>
                );
              }
              return (
                <div
                  key={field}
                  className={styles.noPrefilledField}
                  onClick={() => onFieldClick(field)}
                >
                  <i className='pi pi-database'></i>
                  <div>{field}</div>
                </div>
              );
            })}
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
