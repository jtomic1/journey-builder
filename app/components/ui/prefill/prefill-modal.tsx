import { Dialog } from 'primereact/dialog';
import { Node } from '@xyflow/react';
import styles from './prefill-modal.module.scss';
import { useState } from 'react';
import { FieldOptionsModal } from '../field-options-modal/field-options-modal';

interface PrefillModalProps {
  isVisible: boolean;
  onClose: () => void;
  node: Node;
}

export default function PrefillModal({ isVisible, onClose, node }: PrefillModalProps) {
  const [showSelectedField, setShowSelectedField] = useState<boolean>(false);
  const [selectedField, setSelectedField] = useState<string>('');

  const onFieldClickHandler = (field: string) => {
    setShowSelectedField(true);
    setSelectedField(field);
  };

  const onSelectedFieldClose = () => {
    setShowSelectedField(false);
    setSelectedField('');
  };

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
              return (
                <div
                  key={field}
                  className={styles.noPrefilledField}
                  onClick={() => onFieldClickHandler(field)}
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
