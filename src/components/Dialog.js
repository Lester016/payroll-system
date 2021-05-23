import React from "react";
import {
  Dialog as MaterialDialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@material-ui/core";

const Dialog = ({ title, open, setOpen, children }) => {
  return (
    <MaterialDialog open={open} onClose={setOpen} maxWidth="md">
      <DialogTitle>
        <div style={{ display: "flex" }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </MaterialDialog>
  );
};

export default Dialog;
