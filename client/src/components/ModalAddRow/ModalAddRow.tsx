import { useLayoutEffect, useRef, useState } from 'react';
import { Input } from '../../controls/Input';
import { Modal } from '../Modal/Modal';
import styles from './ModalAddRow.module.css';
import { Button } from '../../controls/Button';
import { ColDef } from 'ag-grid-community';
import { AddRowInput } from '../AddRowInput';

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
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  });

  const handleClickOutsideModal = (e: React.MouseEvent<Node>) => {
    // if current does not exist, then return
    if (!modalAddRowRef.current) return;
    // narrow down the type to Node
    if (!(e.target instanceof Node)) return;

    // handler click to indicate click past the modal
    if (!modalAddRowRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <Modal>
      <div
        className="modal"
        onClick={handleClickOutsideModal}
        style={{
          opacity: isRendered ? 1 : 0,
        }}
      >
        <div className={styles.modalItem} ref={modalAddRowRef}>
          <div className={styles.inputs}>
            {fields.map((field, i) => (
              <AddRowInput field={field} key={i} onChane={handleInputChange} />
            ))}
          </div>
          <div className={styles.submitWrap}>
            <Button onClick={handleInsert}>Add</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
