import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  TextField,
  Button,
  Paper,
  Toolbar,
  InputAdornment,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";

import {
  Search as SearchIcon,
  Delete,
  Cancel,
  Check,
} from "@material-ui/icons/";

import CollapsibleTable from "../components/CollapsibleTable/CollapsibleTable";
import TransitionsModal from "../components/Modal";
import Snack from "../components/Snack";
import NumberInputComponent from "../components/NumberInputComponent";

const columnHeads = [
  {
    id: "employeeId",
    label: "Employee ID",
  },
  {
    id: "name",
    label: "Name",
  },
  {
    id: "deductionAmount",
    label: "Deduction Amount",
  },
  {
    id: "position",
    label: "Position",
  },
  {
    id: "campus",
    label: "Campus",
  },
  {
    id: "college",
    label: "College",
  },
  {
    id: "department",
    label: "Department",
  },
];

const collapsibleColumnHeads = [
  {
    id: "title",
    label:"Title"
  },
  {
    id: "amount",
    label:"Amount"
  }
]

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  createbutton: {
    backgroundColor: "#bf1d38",
    "&:hover": {
      backgroundColor: "#a6172f",
    },
  },
}));

const Deductions = ({ userToken }) => {
  const classes = useStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [deductions, setDeductions] = useState({});
  const [deductionTitle, setDeductionTitle] = useState("");
  const [employees, setEmployees] = useState([]);
  const [amount, setAmount] = useState();
  const [errors, setErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [deleteDeduction, setDeleteDeduction] = useState({
    employeeId: null,
    deductionId: null,
  });

  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  // Get deductions in the database
  useEffect(() => {
    setIsFetching(true);
    axios
      .get("https://tup-payroll.herokuapp.com/api/employees")
      .then((response) => {
        setEmployees(response.data);
        setIsFetching(false);
      })
      .catch((error) => {
        console.log(error);
        setIsFetching(false);
      });
  }, []);

  // Modal toggler
  const handleOpen = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    // Reset to default values
    setDeductionTitle("");
    setAmount();

    setIsModalOpen(false);
    setIsUpdating(null);
  };

  const DeleteOpen = (employeeId, deductionId) => {
    setDeleteDeduction({
      employeeId: employeeId,
      deductionId: deductionId,
    });
  };
  const DeleteClose = () => {
    // Reset to default values.
    setDeleteDeduction({
      employeeId: null,
      deductionId: null,
    });
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
  // Submit Handle
  const handleSubmit = (inputValues, employee_Id, deduction_Id, isEdit) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };
    setIsLoading(true);

    const employeeIndex = employees.findIndex((employee) => {
      return employee._id === employee_Id;
    });
    const employee = employees[employeeIndex];
    let putItem = employee.deductions;

    if (isEdit) {
      let deductionIndex = putItem.findIndex((deduction) => {
        return deduction._id === deduction_Id;
      });
      putItem[deductionIndex] = {
        _id: deduction_Id,
        title: inputValues.title,
        amount: parseFloat(inputValues.amount),
      };
    } else {
      putItem.unshift(inputValues);
    }
    putItem = { deductions: putItem };

    axios
      .put(
        `https://tup-payroll.herokuapp.com/api/employees/deductions/${employee_Id}`,
        putItem,
        config
      )
      .then((response) => {
        let updatedEmployees = Array.from(employees);
        updatedEmployees[employeeIndex] = response.data;
        setEmployees(updatedEmployees);
        setIsLoading(false);

        setSnackMessage("Success submit!");
        handleSnackOpen();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  // Delete handle
  const handleDelete = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };
    setIsLoading(true);

    let employeeIndex = employees.findIndex((employee) => {
      return employee._id === deleteDeduction.employeeId;
    });
    let employee = employees[employeeIndex];
    let putItem = employee.deductions.filter((item) => {
      return item._id !== deleteDeduction.deductionId;
    });
    putItem = { deductions: putItem };

    axios
      .put(
        `https://tup-payroll.herokuapp.com/api/employees/deductions/${deleteDeduction.employeeId}`,
        putItem,
        config
      )
      .then((response) => {
        let updatedEmployees = Array.from(employees);
        updatedEmployees[employeeIndex] = response.data;
        setEmployees(updatedEmployees);
        setIsLoading(false);

        setSnackMessage("Success delete!");
        handleSnackOpen();
        setDeleteDeduction({
          employeeId: null,
          deductionId: null,
        });
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
          return items.filter(
            (x) =>
              x.employeeId.toLowerCase().includes(target.value.toLowerCase()) ||
              x.firstName.toLowerCase().includes(target.value.toLowerCase()) ||
              x.lastName.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  return (
    <div>
      <Toolbar>
        <TextField
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
      </Toolbar>

      <Paper>
        <CollapsibleTable
          lists={employees}
          tab={"deductions"}
          onDeleteRow={DeleteOpen}
          onEditRow={handleEdit}
          filterFn={filterFn}
          columns={columnHeads}
          collapsibleColumns={collapsibleColumnHeads}
          propertiesOrder={columnHeads.slice(0, 5).map((item) => item.id)}
          isLoading={isFetching}
          onSubmit={handleSubmit}
        />
      </Paper>

      <TransitionsModal
        handleClose={DeleteClose}
        isModalOpen={deleteDeduction.deductionId ? true : false}
      >
        {!isLoading ? (
          <>
            <h2>DELETE?</h2>
            <center>
              <p>
                Deleting this results to discarding information included in it.
              </p>
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
            </center>
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

const mapStateToProps = (state) => {
  return {
    userToken: state.auth.token,
  };
};

export default connect(mapStateToProps)(Deductions);
