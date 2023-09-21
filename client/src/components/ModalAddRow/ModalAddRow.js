import { useId, useState } from 'react';
import styles from './ModalAddRow.module.css';
import { AddRowInput } from '../AddRowInput';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Button from '@mui/material/Button';

export function ModalAddRow({ fields, onClose, onInsert, isOpen }) {
  const [values, setValues] = useState({});
  const formId = useId();

  const handleInputChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value === '' ? null : e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onInsert(values);
  };

  const handleClickOutsideModal = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClickOutsideModal} fullWidth>
      <DialogTitle>Add employee</DialogTitle>
      <DialogContent>
        <div className={styles.modalItem}>
          <form className={styles.inputs} onSubmit={handleSubmit} id={formId}>
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
