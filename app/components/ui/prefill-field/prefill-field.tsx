import { FieldMapping } from '@/app/types/node-dependencies';
import styles from './prefill-field.module.scss';

interface PrefillFieldProps {
  mappedValue: FieldMapping | undefined;
  field: string;
  onDeleteClick: () => void;
  onFieldClick: () => void;
}

export default function PrefillField({
  mappedValue,
  field,
  onDeleteClick,
  onFieldClick,
}: PrefillFieldProps) {
  if (mappedValue) {
    return (
      <div className={styles.prefilledField}>
        <div>{`${field}: ${mappedValue.source}.${mappedValue.label}`}</div>
        <i className='pi pi-times-circle' onClick={onDeleteClick}></i>
      </div>
    );
  }
  return (
    <div className={styles.noPrefilledField} onClick={onFieldClick}>
      <i className='pi pi-database'></i>
      <div>{field}</div>
    </div>
  );
}
