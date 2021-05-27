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
} from "@material-ui/core";

import { Add as AddIcon, Search as SearchIcon , Delete , Cancel , Check} from "@material-ui/icons";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Delete,
  Cancel,
} from "@material-ui/icons";

import Table from "../components/Table";
import TransitionsModal from "../components/Modal";
import Snack from "../components/Snack";
import NumberInputComponent from "../components/NumberInputComponent";

const Position = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [positions, setPositions] = useState({});
  const [jobTitle, setJobTitle] = useState("");
  const [taxAmount, setTaxAmount] = useState();
  const [basicSalary, setBasicSalary] = useState();
  const [ratePerHour, setRatePerHour] = useState();
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


  const useStyles= makeStyles(theme=>({
    root:{
      margin:theme.spacing(.5)
    },
    createbutton:{
      backgroundColor:"secondary",
      "&:hover":{
        backgroundColor:"#bf0644"
      },
      borderRadius:'100px',
      
  const useStyles = makeStyles((theme) => ({
    root: {
      margin: theme.spacing(1),
    },
  }));

  const classes = useStyles();

  const columnHeads = [
    {
      id: "title",
      label: "Position Title",
    },
    {
      id: "rate",
      label: "Rate Per Hour",
    },
    {
      id: "tax",
      label: "Tax",
    },
    {
      id: "basicSalary",
      label: "Basic Salary",
    },
    {
      id: "options",
      label: "Options",
      disableSorting: true,
    },
  ];

  // Get positions in the database
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
    // Reset to default values
    setJobTitle("");
    setRatePerHour();
    setTaxAmount();
    setBasicSalary();

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

  // Submit and Edit validation
  const validate = () => {
    let temp = {};
    temp.jobTitle = jobTitle ? "" : "This field is required.";
    temp.ratePerHour = ratePerHour ? "" : "This field is required.";
    temp.basicSalary = basicSalary ? "" : "This field is required.";
    temp.taxAmount = taxAmount ? "" : "This field is required.";

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
              rate: parseFloat(ratePerHour),
              basicSalary: parseFloat(basicSalary),
              tax: parseFloat(taxAmount),
            }
          )
          .then((response) => {
            // Submit the position to the existings positions list.
            setPositions({
              ...positions,
              [response.data.name]: {
                title: jobTitle,
                rate: parseFloat(ratePerHour),
                basicSalary: parseFloat(basicSalary),
                tax: parseFloat(taxAmount),
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
            // Log the error if found || catched.
            console.log(error);
            setIsLoading(false);

            // Close modal
            handleClose();
          });
        e.preventDefault();
      } else {
        // Edit existing position
        axios
          .put(
            `https://tup-payroll-default-rtdb.firebaseio.com/positions/${isUpdating}.json`,
            {
              title: jobTitle,
              rate: parseFloat(ratePerHour),
              basicSalary: parseFloat(basicSalary),
              tax: parseFloat(taxAmount),
            }
          )
          .then(() => {
            // Update the position to the existings positions list.
            setPositions({
              ...positions,
              [isUpdating]: {
                rate: ratePerHour,
                title: jobTitle,
                basicSalary: basicSalary,
                tax: taxAmount,
              },
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

  // Delete handle
  const handleDelete = () => {
    setIsLoading(true);
    axios
      .delete(
        `https://tup-payroll-default-rtdb.firebaseio.com/positions/${deleteKey}.json`
      )
      .then(() => {
        let filteredPositions = { ...positions };
        delete filteredPositions[deleteKey];
        setPositions(filteredPositions);
        setIsLoading(false);

        setSnackMessage("Success delete!");
        handleSnackOpen();
        setDeleteKey(null);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  // Edit handle
  const handleEdit = (key) => {
    const oldJobTitle = positions[key].title;
    const oldRatePerHour = positions[key].rate;
    const oldTaxAmount = positions[key].tax;
    const oldBasicSalary = positions[key].basicSalary;

    setJobTitle(oldJobTitle);
    setRatePerHour(oldRatePerHour);
    setTaxAmount(oldTaxAmount);
    setBasicSalary(oldBasicSalary);

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
      <Toolbar>
        <TextField
          label="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            }}
          onChange={handleSearch}
        />
        <Button
          size="small"
          variant="contained"
          onClick={handleOpen}
          color="primary"
          className={classes.createbutton}
          startIcon={<AddIcon />}
        >
          Create
        </Button>   
      </Toolbar>
      
      <Paper>
        <div>
          <Table
            lists={positions}
            onDeleteRow={DeleteOpen}
            onEditRow={handleEdit}
            filterFn={filterFn}
            columns={columnHeads}
            propertiesOrder={columnHeads.slice(0, 4).map((item) => item.id)}
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
          <h2>DELETE?</h2>
          <center>  
            <p> Deleting this results to discarding information included in it.</p>
            <div>
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

            <center>
              <h4> Are you sure you want to delete that?</h4>
              <div>
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={handleDelete}
                  text-align="center"
                  startIcon={<Delete />}
                  classes={{ root: classes.root }}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={DeleteClose}
                  startIcon={<Cancel />}
                >
                  Cancel
                </Button>
              </div>
            </center>
          </>
        ) : (
          <CircularProgress />
        )}
      </TransitionsModal>

      <TransitionsModal handleClose={handleClose} isModalOpen={isModalOpen}>
        {!isLoading ? (
          <>
          <h2>Position</h2>
          <center>
            <div>
              <TextField
                value={jobTitle}
                label="Job Title"
                onChange={(e) => setJobTitle(e.target.value)}
                classes={{root: classes.root}}
                {...(errors.jobTitle && {
                  error: true,
                  helperText: errors.jobTitle,
                })}
              />
              <TextField
                value={ratePerHour}
                label="Rate Per Hour"
                onChange={(e) => setRatePerHour(e.target.value)}
                classes={{root: classes.root}}
                InputProps={{
                  inputComponent: NumberInputComponent,
                }}
                {...(errors.ratePerHour && {
                  error: true,
                  helperText: errors.ratePerHour,
                })}
              />
            </div>
            
            <div>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={handleSubmit}
                classes={{root: classes.root}}
                startIcon={<Check/>}
              >
                {isUpdating ? "Update" : "Submit"}
              </Button>
              <Button
                variant="contained"
                size="small"
                color="secondary"
                onClick={handleClose}
                classes={{root: classes.root}}
                startIcon={<Cancel/>}
              >
                Cancel
              </Button>
            </div>
          </center>

            <TextField
              value={jobTitle}
              label="Job Title"
              onChange={(e) => setJobTitle(e.target.value)}
              {...(errors.jobTitle && {
                error: true,
                helperText: errors.jobTitle,
              })}
            />
            <TextField
              value={ratePerHour}
              label="Rate Per Hour"
              onChange={(e) => setRatePerHour(e.target.value)}
              InputProps={{
                inputComponent: NumberInputComponent,
              }}
              {...(errors.ratePerHour && {
                error: true,
                helperText: errors.ratePerHour,
              })}
            />

            <TextField
              value={taxAmount}
              label="Tax Amount"
              onChange={(e) => setTaxAmount(e.target.value)}
              InputProps={{
                inputComponent: NumberInputComponent,
              }}
              {...(errors.taxAmount && {
                error: true,
                helperText: errors.taxAmount,
              })}
            />

            <TextField
              value={basicSalary}
              label="Basic Salary"
              onChange={(e) => setBasicSalary(e.target.value)}
              InputProps={{
                inputComponent: NumberInputComponent,
              }}
              {...(errors.basicSalary && {
                error: true,
                helperText: errors.basicSalary,
              })}
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

export default Position;
