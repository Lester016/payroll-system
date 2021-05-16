import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Toolbar,
  InputAdornment,
  CircularProgress,
} from "@material-ui/core";
import { Add as AddIcon, Search as SearchIcon } from "@material-ui/icons/";

import Table from "../components/Table";
import TransitionsModal from "../components/Modal";
import Snack from "../components/Snack";
import NumberInputComponent from "../components/NumberInputComponent";

const Deductions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [deductions, setDeductions] = useState({});
  const [deductionTitle, setDeductionTitle] = useState("");
  const [amount, setAmount] = useState();
  const [errors, setErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [deleteKey, setdeleteKey] = useState(null);

  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const columnHeads = [
    {
      id: "title",
      label: "Description",
    },
    {
      id: "amount",
      label: "Amount",
    },
    {
      id: "options",
      label: "Options",
      disableSorting: true,
    },
  ];

  // Get deductions in the database
  useEffect(() => {
    setIsFetching(true);
    axios
      .get("https://tup-payroll-default-rtdb.firebaseio.com/deductions.json")
      .then((response) => {
        setDeductions(response.data);
        setIsFetching(false);
      })
      .catch((error) => {
        setIsFetching(false);
        console.log(error);
      });
  }, []);

  // Modal toggler
  const handleOpen = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    // Reset to default values.
    setDeductionTitle("");
    setAmount(0);

    setIsModalOpen(false);
    setIsUpdating(null);
  };

  const DeleteOpen = (key) => {
    setdeleteKey(key);
  };
  const DeleteClose = () => {
    // Reset to default values.
    setdeleteKey(null);
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
    temp.deductionTitle = deductionTitle ? "" : "This field is required.";
    temp.amount = amount ? "" : "This field is required.";

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
        //Submit new deduction
        axios
          .post(
            "https://tup-payroll-default-rtdb.firebaseio.com/deductions.json",
            {
              title: deductionTitle,
              amount: parseFloat(amount),
            }
          )
          .then((response) => {
            // Submit the deduction to the existings deductions list.
            setDeductions({
              ...deductions,
              [response.data.name]: {
                title: deductionTitle,
                amount: parseFloat(amount),
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
        //Edit existing deduction
        axios
          .put(
            `https://tup-payroll-default-rtdb.firebaseio.com/deductions/${isUpdating}.json`,
            {
              title: deductionTitle,
              amount: parseFloat(amount),
            }
          )
          .then(() => {
            // Update the deduction to the existings deductions list.
            setDeductions({
              ...deductions,
              [isUpdating]: {
                title: deductionTitle,
                amount: amount,
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
        `https://tup-payroll-default-rtdb.firebaseio.com/deductions/${deleteKey}.json`
      )
      .then(() => {
        let filteredPositions = { ...deductions };
        delete filteredPositions[deleteKey];
        setDeductions(filteredPositions);
        setIsLoading(false);

        setSnackMessage("Success delete!");
        handleSnackOpen();
        setdeleteKey(null);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  // Edit handle
  const handleEdit = (key) => {
    const oldDeductionTitle = deductions[key].title;
    const oldAmount = deductions[key].amount;
    setDeductionTitle(oldDeductionTitle);
    setAmount(oldAmount);
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
      <Paper>
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
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Create New
          </Button>
        </Toolbar>

        <div>
          <Table
            lists={deductions}
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
            Are you sure you want to delete?
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={DeleteClose}
            >
              Cancel
            </Button>
          </>
        ) : (
          <CircularProgress />
        )}
      </TransitionsModal>

      <TransitionsModal handleClose={handleClose} isModalOpen={isModalOpen}>
        {!isLoading ? (
          <>
            <TextField
              value={deductionTitle}
              label="Deduction"
              onChange={(e) => setDeductionTitle(e.target.value)}
              {...(errors.deductionTitle && {
                error: true,
                helperText: errors.deductionTitle,
              })}
            />
            <TextField
              value={amount}
              label="Amount"
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                inputComponent: NumberInputComponent,
              }}
              {...(errors.amount && {
                error: true,
                helperText: errors.amount,
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

export default Deductions;
