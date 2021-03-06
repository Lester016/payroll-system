import React, { useEffect, useState } from "react";
import axios from "axios";
import set from "date-fns/set/index.js";
import { Button, Paper, Toolbar, CircularProgress, makeStyles } from "@material-ui/core";
import { TimePicker } from "@material-ui/pickers";
import { Add as AddIcon , Delete, Cancel} from "@material-ui/icons";

import TransitionsModal from "../components/Modal";
import Table from "../components/Table";
import Snack from "../components/Snack";

const Schedules = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [schedules, setSchedules] = useState({});
  const [timeIn, setTimeIn] = useState(new Date());
  const [timeOut, setTimeOut] = useState(new Date());
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(null);
  const [deleteKey, setDeleteKey] = useState(null);
  const [filterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const useStyles= makeStyles(theme=>({
    root:{
      margin:theme.spacing(1)
    }
  }));

  const classes = useStyles();

  const columnHeads = [
    {
      id: "timeIn",
      label: "Time In",
    },
    {
      id: "timeOut",
      label: "Time Out",
    },
    {
      id: "options",
      label: "Options",
      disableSorting: true,
    },
  ];

  // Get schedules in the database
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
    setIsUpdating(null);
  };

  const DeleteOpen = (key) => {
    setDeleteKey(key);
  };
  const DeleteClose = () => {
    // Reset to default values.
    setDeleteKey(null);
    setIsUpdating(null);
  };

  // Snackbar toggler
  const handleSnackOpen = () => {
    setIsSnackOpen(true);
  };
  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackOpen(false);
  };

  /* ----- HANDLES ----- */
  // Submit handle
  const handleSubmit = () => {
    setIsLoading(true);

    const formattedTimeIn = `${
      timeIn.getHours() > 9 ? timeIn.getHours() : "0" + timeIn.getHours()
    }:${
      timeIn.getMinutes() > 9 ? timeIn.getMinutes() : "0" + timeIn.getMinutes()
    }:00`;

    const formattedTimeOut = `${
      timeOut.getHours() > 9 ? timeOut.getHours() : "0" + timeOut.getHours()
    }:${
      timeOut.getMinutes() > 9
        ? timeOut.getMinutes()
        : "0" + timeOut.getMinutes()
    }:00`;

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

          // Open snackbar
          setSnackMessage("Success submit!");
          handleSnackOpen();
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

          // Open snackbar
          setSnackMessage("Success edit!");
          handleSnackOpen();
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

  // Delete handle
  const handleDelete = () => {
    setIsLoading(true);
    axios
      .delete(
        `https://tup-payroll-default-rtdb.firebaseio.com/schedules/${deleteKey}.json`
      )
      .then(() => {
        let filteredSchedules = { ...schedules };
        delete filteredSchedules[deleteKey];
        setSchedules(filteredSchedules);
        setIsLoading(false);

        setSnackMessage("Success delete!");
        handleSnackOpen();
        setDeleteKey(null);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  // Edit handle
  const handleEdit = (key) => {
    const oldTimeIn = schedules[key].timeIn;
    const oldTimeOut = schedules[key].timeOut;
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
      <Paper>
        <Toolbar>
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Create New
          </Button>
        </Toolbar>

        <div>
          <Table
            lists={schedules}
            onDeleteRow={DeleteOpen}
            onEditRow={handleEdit}
            filterFn={filterFn}
            columns={columnHeads}
            propertiesOrder={columnHeads.slice(0, 2).map((item) => item.id)}
            isLoading={isFetching}
          />
        </div>
      </Paper>

      <TransitionsModal
        handleClose={DeleteClose}
        isModalOpen={deleteKey ? true : false}
      >
        {!isLoading ? (
          <>
          <center>
            <h4> Are you sure you want to delete that?</h4>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={handleDelete}
              text-align="center"
              startIcon={<Delete/>}
              classes={{root: classes.root}}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={DeleteClose}
              startIcon={<Cancel/>}
            >
              Cancel
            </Button>
          </center>
          </>
        ) : (
          <CircularProgress />
        )}
      </TransitionsModal>

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

      <Snack
        open={isSnackOpen}
        message={snackMessage}
        handleClose={handleSnackClose}
      />
    </div>
  );
};

export default Schedules;
