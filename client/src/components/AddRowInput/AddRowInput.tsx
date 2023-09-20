import styles from './AddRowInput.module.css';
import { Input } from '../../controls/Input';
import { useId } from 'react';
import { ITablesColumnDef } from 'components/ModalAddRow/ModalAddRow';

interface IAddRowInputProps {
  field: ITablesColumnDef;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AddRowInput({ field, onChange }: IAddRowInputProps) {
  const id = useId();
  const type = field.customInfo?.inputType;

  return (
    <div className={styles.addRowInput}>
      <label htmlFor={id}>{field.field}</label>
      <Input id={id} name={field.field} placeholder={field.field} type={type} onChange={onChange} />
    </div>
  );
}
