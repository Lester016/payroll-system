import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Toolbar,
  InputAdornment,
  CircularProgress,
  makeStyles,
  Fab,
  Container,
} from "@material-ui/core";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
} from "@material-ui/icons";

import CollapsibleTable from "../components/CollapsibleTable/CollapsibleTable";
import TransitionsModal from "../components/Modal";
import Snack from "../components/Snack";

const Position = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [positions, setPositions] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [errors, setErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [deleteKey, setDeleteKey] = useState(null);

  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const useStyles = makeStyles((theme) => ({
    root: {
      margin: theme.spacing(0.5),
    },
    createbutton: {
      backgroundColor: "#bf1d38",
      "&:hover": {
        backgroundColor: "#a6172f",
      },
      margin: 10,
    },
    submitButton: {
      marginTop: 10,
      borderRadius: 15,
      marginRight: 10,
      backgroundColor: "#bf1d38",
      "&:hover": {
        backgroundColor: "#a6172f",
      },
    },
    cancelButton: {
      marginTop: 10,
      borderRadius: 15,
      backgroundColor: "#8388a5",
      "&:hover": {
        backgroundColor: "#5f6484",
      },
    },
    textField: {
      marginTop: 20,
      marginBottom: 10,
    },
    paper: {
      padding: 0,
    },
  }));

  const classes = useStyles();

  const columnHeads = [
    {
      id: "title",
      label: "Position Title",
    },
    {
      id: "options",
      label: "Options",
      disableSorting: true,
    },
  ];

  const collapsibleColumnHeads = [
    {
      id: "step",
      label: "Step",
    },

    {
      id: "amount",
      label: "Amount",
    },
  ];

  // Get positions in the database
  useEffect(() => {
    setIsFetching(true);
    axios
      .get("https://tup-payroll-default-rtdb.firebaseio.com/positions.json")
      .then((response) => {
        setPositions(reversedObjectToArray(response.data));
        setIsFetching(false);
      })
      .catch((error) => {
        console.log(error);
        setIsFetching(false);
      });
  }, []);

  const reversedObjectToArray = (lists) => {
    const result = [];
    for (let key in lists) {
      result.push(Object.assign({ id: key }, lists[key]));
    }
    return result.reverse();
  };

  // Modal toggler.
  const handleOpen = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    // Reset to default values
    setJobTitle("");

    setIsModalOpen(false);
    setIsUpdating(null);
  };

  const deleteOpen = (key) => {
    setDeleteKey(key);
  };
  const deleteClose = () => {
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

  // Submit and Edit validation
  const validate = () => {
    let temp = {};
    temp.jobTitle = jobTitle ? "" : "This field is required.";

    setErrors({
      ...temp,
    });

    return Object.values(temp).every((x) => x === "");
  };

  /* ----- HANDLES ----- */
  // Submit handle
  const handleSubmit = (e) => {
    if (validate()) {
      setIsLoading(true);
      if (isUpdating === null) {
        // Submit new position
        axios
          .post(
            "https://tup-payroll-default-rtdb.firebaseio.com/positions.json",
            {
              title: jobTitle,
              steps: [0, 0, 0, 0, 0, 0, 0, 0],
            }
          )
          .then((response) => {
            // Submit the position to the existings positions list.
            setPositions((prevPositions) => {
              let data = [...prevPositions];
              data.unshift({
                id: response.data.name,
                title: jobTitle,
                steps: [0, 0, 0, 0, 0, 0, 0, 0],
              });
              return data;
            });
            setIsLoading(false);

            // Close modal
            handleClose();

            // Open snackbar
            setSnackMessage("Success submit!");
            handleSnackOpen();
          })
          .catch((error) => {
            // Log the error if found || catched.
            console.log(error);
            setIsLoading(false);

            // Close modal
            handleClose();
          });
        e.preventDefault();
      } else {
        // Edit existing position
        let prevPosition = positions.find((item) => item.id === isUpdating);
        axios
          .put(
            `https://tup-payroll-default-rtdb.firebaseio.com/positions/${isUpdating}.json`,
            {
              title: jobTitle,
              steps: prevPosition.steps,
            }
          )
          .then((response) => {
            // Update the position to the existings positions list.
            setPositions((prevPositions) => {
              let data = [...prevPositions];
              const idx = positions.findIndex((item) => item.id === isUpdating);
              data[idx] = {
                id: prevPosition.id,
                title: jobTitle,
                steps: prevPosition.steps,
              };
              return data;
            });
            setIsLoading(false);

            // Close modal
            handleClose();

            // Open snackbar
            setSnackMessage("Success edit!");
            handleSnackOpen();
          })
          .catch((error) => {
            // Log the error if found || catched.
            console.log(error);
            setIsLoading(false);

            // Close modal
            handleClose();
          });
      }
    }
  };

  const handleCollapsibleSubmit = (parentId, idx, amount) => {
    let updatedPosition = positions.find((item) => item.id === parentId);
    updatedPosition.steps[idx] = amount;
    axios
      .put(
        `https://tup-payroll-default-rtdb.firebaseio.com/positions/${parentId}.json`,
        {
          title: updatedPosition.title,
          steps: updatedPosition.steps.map(Number),
        }
      )
      .then(() => {
        // Update the position to the existings positions list.
        setPositions((prevPositions) => {
          let data = [...prevPositions];
          const idx = positions.findIndex((item) => item.id === parentId);
          data[idx] = {
            id: parentId,
            title: updatedPosition.title,
            steps: updatedPosition.steps.map(Number),
          };
          return data;
        });
        setIsLoading(false);

        setSnackMessage("Success edit!");
        handleSnackOpen();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  // Delete handle
  const handleDelete = () => {
    setIsLoading(true);
    axios
      .delete(
        `https://tup-payroll-default-rtdb.firebaseio.com/positions/${deleteKey}.json`
      )
      .then(() => {
        setPositions((prevPositions) => {
          let data = [...prevPositions];
          data = data.filter((item) => {
            return item.id !== deleteKey;
          });
          return data;
        });
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
    const oldPosition = positions.find((item) => item.id === key);
    setJobTitle(oldPosition.title);
    setIsUpdating(key);
    handleOpen();
  };

  // Handles change in Search Bar
  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") return items;
        else
          return items.filter((x) =>
            x.title.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  return (
    <div>
      <Container component={Paper} className={classes.paper}>
        <Toolbar>
          <TextField
            size="small"
            label="Search..."
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={handleSearch}
          />
          <Fab
            size="medium"
            onClick={handleOpen}
            color="primary"
            className={classes.createbutton}
          >
            <AddIcon />
          </Fab>
        </Toolbar>

        <Paper>
          <CollapsibleTable
            lists={positions}
            onDeleteRow={deleteOpen}
            onEditRow={handleEdit}
            onSubmitCollapsibleRow={handleCollapsibleSubmit}
            tab={"positions"}
            filterFn={filterFn}
            columns={columnHeads}
            collapsibleColumns={collapsibleColumnHeads}
            propertiesOrder={columnHeads.slice(0, 2).map((item) => item.id)}
            isLoading={isFetching}
          />
        </Paper>
      </Container>

      <TransitionsModal
        handleClose={deleteClose}
        isModalOpen={deleteKey ? true : false}
        title="Delete Position"
      >
        {!isLoading ? (
          <>
            <center>
              <h4> Are you sure you want to delete that?</h4>
              <div>
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={handleDelete}
                  text-align="center"
                  startIcon={<DeleteIcon />}
                  classes={{ root: classes.root }}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={deleteClose}
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
              </div>
            </center>
          </>
        ) : (
          <center>
            <CircularProgress />
          </center>
        )}
      </TransitionsModal>

      <TransitionsModal
        handleClose={handleClose}
        isModalOpen={isModalOpen}
        title={"Add Position"}
      >
        {!isLoading ? (
          <>
            <center>
              <div>
                <TextField
                  className={classes.textField}
                  value={jobTitle}
                  label="Job Title"
                  variant="outlined"
                  onChange={(e) => setJobTitle(e.target.value)}
                  classes={{ root: classes.root }}
                  {...(errors.jobTitle && {
                    error: true,
                    helperText: errors.jobTitle,
                  })}
                />
              </div>

              <div>
                <Button
                  className={classes.submitButton}
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={handleSubmit}
                >
                  {isUpdating ? "Update" : "Submit"}
                </Button>
                <Button
                  className={classes.cancelButton}
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </div>
            </center>
          </>
        ) : (
          <center>
            <CircularProgress />
          </center>
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

export default Position;
