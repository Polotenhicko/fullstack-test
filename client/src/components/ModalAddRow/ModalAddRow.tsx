import { useId, useLayoutEffect, useRef, useState } from 'react';
import styles from './ModalAddRow.module.css';
import { ColDef } from 'ag-grid-community';
import { AddRowInput } from '../AddRowInput';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Button from '@mui/material/Button';

export interface ITablesColumnDef extends ColDef {
  customInfo: {
    inputType: string;
    required: boolean;
  };
}

interface IModalArrRowProps {
  fields: ITablesColumnDef[];
  onClose: () => void;
  onInsert: (values: Record<string, string>) => void;
}

export function ModalAddRow({ fields, onClose, onInsert }: IModalArrRowProps) {
  const [isRendered, setIsRendered] = useState(false);
  const [values, setValues] = useState({});
  const formId = useId();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleInsert = () => {
    onInsert(values);
  };

  useLayoutEffect(() => {
    setIsRendered(true);
  });

  const handleClickOutsideModal = (e: any) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <Dialog open={isRendered} onClose={handleClickOutsideModal} fullWidth>
      <DialogTitle>Add employee</DialogTitle>
      <DialogContent>
        <div className={styles.modalItem}>
          <form className={styles.inputs} onSubmit={handleInsert} id={formId}>
            {fields.map((field, i) => (
              <AddRowInput field={field} key={i} onChange={handleInputChange} />
            ))}
          </form>
        </div>
      </DialogContent>
      <DialogActions>
        <Button type="submit" form={formId} variant="contained" disableElevation sx={{ color: '#fff' }}>
          Add
        </Button>
        <Button onClick={handleClickOutsideModal} variant="contained" disableElevation sx={{ color: '#fff' }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
