import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export function ConfirmForDelete({ isOpen, confirmationText, onAgree, onClose }) {
  const handleAgree = (e) => {
    e.stopPropagation();
    onAgree();
    onClose();
  };

  const handleClickOutsideModal = (e) => {
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
