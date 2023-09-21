import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import styles from './ConfirmForDelete.module.css';

interface IConfirmForDeleteProps {
  isOpen: boolean;
  confirmationText: string;
  onAgree: () => void;
  onClose: () => void;
}

export function ConfirmForDelete({ isOpen, confirmationText, onAgree, onClose }: IConfirmForDeleteProps) {
  const handleAgree = (e: any) => {
    e.stopPropagation();
    onAgree();
    onClose();
  };

  const handleClickOutsideModal = (e: any) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClickOutsideModal} fullWidth>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>{confirmationText}</DialogContent>
      <DialogActions>
        <Button onClick={handleAgree} variant="contained" disableElevation sx={{ color: '#fff' }}>
          Yes
        </Button>
        <Button onClick={handleClickOutsideModal} variant="contained" disableElevation sx={{ color: '#fff' }}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}
