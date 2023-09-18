import { ColDef } from 'ag-grid-community';
import styles from './AddRowInput.module.css';
import { Input } from '../../controls/Input';
import { useId } from 'react';
import { getCellDataType } from '../../utils/getCellDataType';

interface IAddRowInputProps {
  field: ColDef;
  onChane: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AddRowInput({ field, onChane }: IAddRowInputProps) {
  const id = useId();
  const type = getCellDataType(field.cellDataType);

  return (
    <div className={styles.addRowInput}>
      <label htmlFor={id}>{field.field}</label>
      <Input id={id} name={field.field} placeholder={field.field} type={type} onChange={onChane} />
    </div>
  );
}
