import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { TimePicker } from "@material-ui/pickers";
import axios from "axios";
import set from "date-fns/set/index.js";

import TransitionsModal from "../components/Modal";
import Table from "../components/Table";

const Schedules = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState({});
  const [timeIn, setTimeIn] = useState(new Date());
  const [timeOut, setTimeOut] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get || Read schedules in firebase server.
    axios
      .get("https://tup-payroll-default-rtdb.firebaseio.com/schedules.json")
      .then((response) => {
        setSchedules(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(schedules);
  }, []);

  // Modal toggler.
  const handleOpen = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    // Reset to default values.
    setTimeIn(new Date());
    setTimeOut(new Date());

    setIsModalOpen(false);
  };

  // Submit handler.
  const handleSubmit = () => {
    setIsLoading(true);

    const formattedTimeIn = `${
      timeIn.getHours() > 9 ? timeIn.getHours() : "0" + timeIn.getHours()
    } : ${
      timeIn.getMinutes() > 9 ? timeIn.getMinutes() : "0" + timeIn.getMinutes()
    } : 00`;

    const formattedTimeOut = `${
      timeOut.getHours() > 9 ? timeOut.getHours() : "0" + timeOut.getHours()
    } : ${
      timeOut.getMinutes() > 9
        ? timeOut.getMinutes()
        : "0" + timeOut.getMinutes()
    } : 00`;

    // Create new schedule in firebase server.
    axios
      .post("https://tup-payroll-default-rtdb.firebaseio.com/schedules.json", {
        timeIn: formattedTimeIn,
        timeOut: formattedTimeOut,
      })
      .then((response) => {
        // Add the schedule to the existings schedules list.
        setSchedules({
          ...schedules,
          [response.data.name]: {
            timeIn: formattedTimeIn,
            timeOut: formattedTimeOut,
          },
        });
        setIsLoading(false);
      })
      .catch((error) => {
        // log the error if found || catched.
        console.log(error);
      });

    // Close modal
    handleClose();
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
      <Table
        lists={schedules}
        onDeleteRow={() => {}}
        columns={["Time In", "Time Out", "Options"]}
        propertiesOrder={["timeIn", "timeOut"]}
      />

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

        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={handleClose}
        >
          Cancel
        </Button>
      </TransitionsModal>
    </div>
  );
};

export default Schedules;
