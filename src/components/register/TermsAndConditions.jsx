import * as React from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

export default function TermsAndConditions({ open, onAgree, onClose }) {

  return (
    <Dialog open={open} onClose={onClose} scroll='body'>
      <DialogTitle>Terms of Use</DialogTitle>
      <DialogContent dividers>
      <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
          >
            {[...new Array(50)]
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
              )
              .join('\n')}
          </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onAgree}>Agree</Button>
      </DialogActions>
    </Dialog>
  );
}