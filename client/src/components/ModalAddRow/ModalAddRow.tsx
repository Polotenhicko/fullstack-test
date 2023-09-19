import { useLayoutEffect, useRef, useState } from 'react';
import { Input } from '../../controls/Input';
import { Modal } from '../Modal/Modal';
import styles from './ModalAddRow.module.css';
import { ColDef } from 'ag-grid-community';
import { AddRowInput } from '../AddRowInput';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Button from '@mui/material/Button';

interface IModalArrRowProps {
  fields: ColDef[];
  onClose: () => void;
  onInsert: (values: Record<string, string>) => void;
}

export function ModalAddRow({ fields, onClose, onInsert }: IModalArrRowProps) {
  const modalAddRowRef = useRef<HTMLDivElement | null>(null);
  const [isRendered, setIsRendered] = useState(false);

  const [values, setValues] = useState({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleInsert = () => {
    onInsert(values);
  };

  useLayoutEffect(() => {
    setIsRendered(true);
  });

  const handleClickOutsideModal = () => {
    onClose();
  };

  return (
    <Dialog open={isRendered} onClose={handleClickOutsideModal}>
      <DialogTitle>Add employee</DialogTitle>
      <DialogContent>
        <div className={styles.modalItem} ref={modalAddRowRef}>
          <div className={styles.inputs}>
            {fields.map((field, i) => (
              <AddRowInput field={field} key={i} onChange={handleInputChange} />
            ))}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleInsert} variant="contained" disableElevation sx={{ color: '#fff' }}>
          Add
        </Button>
        <Button onClick={handleClickOutsideModal} variant="contained" disableElevation sx={{ color: '#fff' }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );

  // return (
  //   <Modal>
  //     <div
  //       className="modal"
  //       onClick={handleClickOutsideModal}
  //       style={{
  //         opacity: isRendered ? 1 : 0,
  //       }}
  //     >
  //       <div className={styles.modalItem} ref={modalAddRowRef}>
  //         <div className={styles.inputs}>
  //           {fields.map((field, i) => (
  //             <AddRowInput field={field} key={i} onChane={handleInputChange} />
  //           ))}
  //         </div>
  //         <div className={styles.submitWrap}>
  //           <Button onClick={handleInsert}>Add</Button>
  //         </div>
  //       </div>
  //     </div>
  //   </Modal>
  // );
}
