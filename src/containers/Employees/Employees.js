import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Container,
  Paper,
  Grid,
  Toolbar,
  TextField,
  Button,
  InputAdornment,
} from "@material-ui/core";
import { Add as AddIcon, Search as SearchIcon } from "@material-ui/icons";

import EmployeeForm from "./EmployeeForm";
import Table from "../../components/Table";
import Dialog from "../../components/Dialog";
import Snack from "../../components/Snack";

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
  {
    id: "contactInfo",
    label: "Contact Info",
  },
  {
    id: "options",
    label: "Options",
    disableSorting: true,
  },
];

const initialValues = {
  firstName: "",
  lastName: "",
  gender: "male",
  campus: {
    name: "",
    idx: -1,
  },
  college: {
    name: "",
    idx: -1,
  },
  dept: {
    name: "",
    idx: -1,
  },
  type: "regular",
  email: "",
  contactInfo: "",
  address: "",
  birthDate: new Date(),
  positionTitle: "",
  positionRate: 0,
  deductions: [],
};

const Employees = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(null);
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [employees, setEmployees] = useState({});
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  // Get employees in the database
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

  const DeleteOpen = () => {};

  // Modal toggler.
  const handleOpen = () => {
    setEmployeeFormOpen(true);
  };
  const handleClose = () => {
    // Reset to default values
    setValues(initialValues);

    setEmployeeFormOpen(false);
    //setIsUpdating(null);
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

  // FORM VALIDATION
  const validate = (fieldValues = values) => {
    let temp = {};
    temp.firstName = /^[a-z ,.'-]+$/i.test(fieldValues.firstName.trim())
      ? ""
      : "This field is required.";
    temp.lastName = /^[a-z ,.'-]+$/i.test(fieldValues.lastName.trim())
      ? ""
      : "This field is required.";
    temp.campus = fieldValues.campus.name ? "" : "This field is required.";
    temp.college = fieldValues.college.name ? "" : "This field is required.";
    temp.dept = fieldValues.dept.name ? "" : "This field is required.";
    temp.email = /\S+@\S+\.\S+/.test(fieldValues.email.trim())
      ? ""
      : "Email adress is invalid.";
    temp.contactInfo =
      fieldValues.contactInfo.length === 11
        ? ""
        : "Contact Number must be 11 digits.";
    temp.positionTitle = fieldValues.positionTitle
      ? ""
      : "This field is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  // EMPLOYEE FORM HANDLES
  const handleSubmit = (e) => {
    if (validate()) {
      setIsLoading(true);
      if (isUpdating === null) {
        let postItem = {
          firstName: values.firstName,
          lastName: values.lastName,
          gender: values.gender === "male" ? "m" : "f",
          campus: values.campus.name,
          college: values.college.name,
          dept: values.dept.name,
          isPartTime: values.isPartTime === "part-timer" ? true : false,
          email: values.email,
          contactInfo: values.contactInfo,
          address: values.address,
          birthDate: values.birthDate,
          position: {
            title: values.positionTitle,
            rate: values.positionRate,
          },
          deductions: [],
        };
        // Submit new position
        axios
          .post(
            "https://tup-payroll.herokuapp.com/api/employees",
            postItem
          )
          .then((response) => {
            // Submit the position to the existings positions list.
            setEmployees({
              ...employees,
              postItem,
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
      }
    }
  };
  const handleDelete = () => {
    /*
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
      */
  };
  const handleEdit = () => {};
  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") return items;
        else
          return items.filter(
            (x) =>
              x.lastName.toLowerCase().includes(target.value.toLowerCase()) ||
              x.firstName.toLowerCase().includes(target.value.toLowerCase()) ||
              x.employeeId.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };
  const handleReset = () => {
    setValues(initialValues);
  };

  return (
    <>
      <Container component={Paper}>
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
            onClick={() => setEmployeeFormOpen(true)}
          >
            Create New
          </Button>
        </Toolbar>
        <Table
          lists={employees}
          onDeleteRow={DeleteOpen}
          onEditRow={handleEdit}
          filterFn={filterFn}
          columns={columnHeads}
          propertiesOrder={columnHeads.slice(0, 7).map((item) => item.id)}
          isLoading={isFetching}
        />
      </Container>

      <Dialog
        title="Add Employee"
        open={employeeFormOpen}
        setOpen={setEmployeeFormOpen}
      >
        <EmployeeForm
          values={values}
          setValues={setValues}
          errors={errors}
          setErrors={setErrors}
          onSubmit={handleSubmit}
          onEdit={handleEdit}
          onReset={handleReset}
        />
      </Dialog>

      <Snack
        open={isSnackOpen}
        message={snackMessage}
        handleClose={handleSnackClose}
      />
    </>
  );
};

export default Employees;
