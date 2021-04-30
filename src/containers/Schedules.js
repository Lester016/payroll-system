import React, { useEffect, useState } from "react";
import axios from "axios";
import set from "date-fns/set/index.js";

import Button from "@material-ui/core/Button";
import TimePicker from "@material-ui/pickers/TimePicker";
import CircularProgress from "@material-ui/core/CircularProgress";

import TransitionsModal from "../components/Modal";
import Table from "../components/Table";

const Schedules = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState({});
  const [timeIn, setTimeIn] = useState(new Date());
  const [timeOut, setTimeOut] = useState(new Date());
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(null);

  useEffect(() => {
    setIsFetching(true);
    // Get || Read schedules in firebase server.
    axios
      .get("https://tup-payroll-default-rtdb.firebaseio.com/schedules.json")
      .then((response) => {
        setSchedules(response.data);
        setIsFetching(false);
      })
      .catch((error) => {
        setIsFetching(false);
        console.log(error);
      });
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
    setIsUpdating(false);
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

    if (isUpdating === null) {
      // Create new schedule in firebase server.
      axios
        .post(
          "https://tup-payroll-default-rtdb.firebaseio.com/schedules.json",
          {
            timeIn: formattedTimeIn,
            timeOut: formattedTimeOut,
          }
        )
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

          // Close modal
          handleClose();
        })
        .catch((error) => {
          // log the error if found || catched.
          console.log(error);
          setIsLoading(false);

          // Close modal
          handleClose();
        });
    } else {
      // Update single schedule in firebase server.
      axios
        .put(
          `https://tup-payroll-default-rtdb.firebaseio.com/schedules/${isUpdating}.json`,
          {
            timeIn: formattedTimeIn,
            timeOut: formattedTimeOut,
          }
        )
        .then(() => {
          // Update the schedule to the existings schedules list.
          setSchedules({
            ...schedules,
            [isUpdating]: {
              timeIn: formattedTimeIn,
              timeOut: formattedTimeOut,
            },
          });
          setIsLoading(false);
          setIsUpdating(null);
          // Close modal
          handleClose();
        })
        .catch((error) => {
          // log the error if found || catched.
          console.log(error);
          setIsLoading(false);
          setIsUpdating(null);
          // Close modal
          handleClose();
        });
    }
  };

  const deleteHandler = (key) => {
    setIsLoading(true);
    axios
      .delete(
        `https://tup-payroll-default-rtdb.firebaseio.com/schedules/${key}.json`
      )
      .then(() => {
        let filteredSchedules = { ...schedules };
        delete filteredSchedules[key];
        setSchedules(filteredSchedules);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const editHandler = (key) => {
    const oldTimeIn = schedules[key].timeIn.replace(/\s/g, "");
    const oldTimeOut = schedules[key].timeOut.replace(/\s/g, "");
    const newTimeIn = set(new Date(), {
      hours: oldTimeIn.substring(0, 2),
      minutes: oldTimeIn.substring(3, 5),
    });
    const newTimeOut = set(new Date(), {
      hours: oldTimeOut.substring(0, 2),
      minutes: oldTimeOut.substring(3, 5),
    });

    setTimeIn(newTimeIn);
    setTimeOut(newTimeOut);
    setIsUpdating(key);
    handleOpen();
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
        onDeleteRow={deleteHandler}
        onEditRow={editHandler}
        columns={["Time In", "Time Out", "Options"]}
        propertiesOrder={["timeIn", "timeOut"]}
        isLoading={isFetching}
      />

      <TransitionsModal handleClose={handleClose} isModalOpen={isModalOpen}>
        {!isLoading ? (
          <>
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
              {isUpdating ? "Update" : "Submit"}
            </Button>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </>
        ) : (
          <CircularProgress />
        )}
      </TransitionsModal>
    </div>
  );
};

export default Schedules;
