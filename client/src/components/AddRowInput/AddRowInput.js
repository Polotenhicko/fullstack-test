import styles from './AddRowInput.module.css';
import { Input } from '../../controls/Input';
import { useId } from 'react';

export function AddRowInput({ field, onChange }) {
  const id = useId();
  const type = field.customInfo.inputType;
  const required = field.customInfo.required;

  return (
    <div className={styles.addRowInput}>
      <label htmlFor={id}>{field.field}</label>
      <Input
        id={id}
        name={field.field}
        required={required}
        placeholder={field.field}
        type={type}
        onChange={onChange}
      />
    </div>
  );
}
