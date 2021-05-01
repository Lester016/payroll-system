import axios from "axios";
import React, { useEffect, useState } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";

import Table from "../components/Table";
import TransitionsModal from "../components/Modal";

const Position = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [positions, setPositions] = useState({});
  const [jobTitle, setJobTitle] = useState("");
  const [ratePerHour, setRatePerHour] = useState(0);
  const [isUpdating, setIsUpdating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setIsFetching(true);
    axios
      .get("https://tup-payroll-default-rtdb.firebaseio.com/positions.json")
      .then((response) => {
        setPositions(response.data);
        setIsFetching(false);
      })
      .catch((error) => {
        console.log(error);
        setIsFetching(false);
      });
  }, []);

  // Modal toggler.
  const handleOpen = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    // Reset to default values.
    setJobTitle("");
    setRatePerHour(0);

    setIsModalOpen(false);
    setIsUpdating(null);
  };

  const handleSubmit = (e) => {
    setIsLoading(true);
    if (isUpdating === null) {
      axios
        .post(
          "https://tup-payroll-default-rtdb.firebaseio.com/positions.json",
          {
            title: jobTitle,
            rate: parseFloat(ratePerHour),
          }
        )
        .then((response) => {
          setPositions({
            ...positions,
            [response.data.name]: {
              rate: ratePerHour,
              title: jobTitle,
            },
          });
          setIsLoading(false);
          handleClose();
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          handleClose();
        });
      e.preventDefault();
    } else {
      axios
        .put(
          `https://tup-payroll-default-rtdb.firebaseio.com/positions/${isUpdating}.json`,
          {
            title: jobTitle,
            rate: parseFloat(ratePerHour),
          }
        )
        .then(() => {
          // Update the schedule to the existings schedules list.
          setPositions({
            ...positions,
            [isUpdating]: {
              rate: ratePerHour,
              title: jobTitle,
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
    }
  };

  const deleteHandler = (key) => {
    setIsLoading(true);
    axios
      .delete(
        `https://tup-payroll-default-rtdb.firebaseio.com/positions/${key}.json`
      )
      .then(() => {
        let filteredPositions = { ...positions };
        delete filteredPositions[key];
        setPositions(filteredPositions);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const editHandler = (key) => {
    const oldJobTitle = positions[key].title;
    const oldRatePerHour = positions[key].rate;
    setJobTitle(oldJobTitle);
    setRatePerHour(oldRatePerHour);
    setIsUpdating(key);
    handleOpen();
  };

  return (
    <div>
      <h1>Positions Screen</h1>
      <Paper>
        <Toolbar>
          {/*insert search textfield here*/}

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
            lists={positions}
            onDeleteRow={deleteHandler}
            onEditRow={editHandler}
            columns={["Position Title", "Rate Per Hour", "Options"]}
            propertiesOrder={["title", "rate"]}
            isLoading={isFetching}
          />
        </div>
      </Paper>

      <TransitionsModal handleClose={handleClose} isModalOpen={isModalOpen}>
        {!isLoading ? (
          <>
            <TextField
              value={jobTitle}
              label="Job Title"
              onChange={(e) => setJobTitle(e.target.value)}
            />
            <TextField
              value={ratePerHour}
              label="Rate Per Hour"
              onChange={(e) => setRatePerHour(e.target.value)}
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

export default Position;
