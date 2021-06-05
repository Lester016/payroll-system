import React from "react";
import {
  makeStyles,
  Modal,
  Backdrop,
  Fade,
  Card,
  CardContent,
  DialogTitle,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    minWidth: 275,
  },
  dialog: {
    backgroundColor: "#234",
    color: "#fff",
  },
}));

const TransitionsModal = ({ isModalOpen, handleClose, children, title }) => {
  const classes = useStyles();

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={isModalOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isModalOpen}>
          <Card className={classes.root}>
            <DialogTitle className={classes.dialog}>Add {title}</DialogTitle>
            <CardContent>{children}</CardContent>
          </Card>
        </Fade>
      </Modal>
    </div>
  );
};

export default TransitionsModal;
