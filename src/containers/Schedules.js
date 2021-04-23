import React, { useState } from "react";
import Button from "@material-ui/core/Button";

import TransitionsModal from "../components/Modal";

const Schedules = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      <TransitionsModal handleClose={handleClose} isModalOpen={isModalOpen} />
    </div>
  );
};

export default Schedules;
