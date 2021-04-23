import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { TimePicker } from "@material-ui/pickers";
import TransitionsModal from "../components/Modal";

const Schedules = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // The first commit of Material-UI
  const [timeIn, setTimeIn] = useState(new Date());
  const [timeOut, setTimeOut] = useState(new Date());

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Schedules Screen</h1>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={handleOpen}
      >
        Create New
      </Button>

      <TransitionsModal handleClose={handleClose} isModalOpen={isModalOpen}>
        <TimePicker
          value={timeIn}
          label="Time In"
          onChange={(e) => setTimeIn(e)}
        />
        <TimePicker
          value={timeOut}
          label="Time Out"
          onChange={(e) => setTimeOut(e)}
        />
      </TransitionsModal>
    </div>
  );
};

export default Schedules;
