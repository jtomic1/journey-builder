import { Node } from '@xyflow/react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useAppDispatch } from '../../../store/store';
import { getDataSections } from '../../../utils/field-options-util';
import { Dependencies, FieldMapping } from '../../../types/node-dependencies';
import { useState } from 'react';
import styles from './field-options-modal.module.scss';
import { updateFormFieldMapping } from '../../../store/graph-slice';
import { useSearchParams } from 'next/navigation';
import { FieldInheritanceType } from '@/app/enums/field-inheritance-type';

interface FieldOptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  node: Node;
  field: string;
}

export function FieldOptionsModal({ isVisible, onClose, node, field }: FieldOptionsModalProps) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const deps = searchParams.get('deps')?.split('-');
  const dataSections = getDataSections(
    node.data.dependencies as Dependencies,
    deps as FieldInheritanceType[],
  );

  const [selectedOption, setSelectedOption] = useState<FieldMapping | null>(null);

  function onOptionClick(option: FieldMapping) {
    if (selectedOption?.value === option.value) setSelectedOption(null);
    else setSelectedOption(option);
  }

  function onSave() {
    if (selectedOption) {
      dispatch(
        updateFormFieldMapping({
          nodeId: node.id,
          fieldName: field,
          mapping: {
            ...selectedOption,
          },
        }),
      );
      onClose();
    }
  }

  const footer = (
    <>
      <Button
        className='saveButton'
        label='Save'
        icon='pi pi-save'
        disabled={selectedOption === null}
        tooltip={selectedOption === null ? 'Please select an option' : ''}
        tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
        onClick={onSave}
      />
      <Button label='Cancel' onClick={onClose} severity='danger' icon='pi pi-times' />
    </>
  );

  return (
    <Dialog
      header={`Available dependency fields for '${field}'`}
      style={{ width: '50vw' }}
      onHide={onClose}
      visible={isVisible}
      footer={footer}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        <Accordion>
          {dataSections.map((section, index) => {
            return (
              <AccordionTab key={index} header={section.title}>
                <div className={styles.optionsContainer}>
                  {section.options.map((option, index) => {
                    return (
                      <div
                        key={index}
                        className={`${styles.option} ${option.value === selectedOption?.value ? styles.active : ''}`}
                        onClick={() => onOptionClick(option)}
                      >
                        {option.label}
                      </div>
                    );
                  })}
                </div>
              </AccordionTab>
            );
          })}
        </Accordion>
        <div className={styles.selectedOptionContainer}>
          <div>
            {!selectedOption ? (
              <p>Please select a value to continue.</p>
            ) : (
              <p>
                Selected value:
                <br />
                <span style={{ fontWeight: 'bold' }}>{selectedOption.value}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
