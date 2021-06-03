import axios from "axios";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { CSVLink } from "react-csv";
import {
  makeStyles,
  Container,
  Paper,
  Toolbar,
  Button,
  CircularProgress,
  InputAdornment,
  Fab,
} from "@material-ui/core";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
} from "@material-ui/icons";

import EmployeeForm from "./EmployeeForm";
import Table from "../../components/Table";
import TextField from "../../components/TextField";
import Dialog from "../../components/Dialog";
import TransitionsModal from "../../components/Modal";
import Snack from "../../components/Snack";

const initialValues = {
  firstName: "",
  lastName: "",
  gender: "M",
  campus: {
    name: "",
    idx: -1,
  },
  college: {
    name: "",
    idx: -1,
  },
  department: {
    name: "",
    idx: -1,
  },
  isPartTime: false,
  email: "",
  contactInfo: "",
  address: "",
  birthDate: new Date(),
  positionTitle: "",
  positionRate: "",
  salary: "",
};

const useStyles = makeStyles((theme) => ({
  createButton: {
    backgroundColor: "#bf1d38",
    "&:hover": {
      backgroundColor: "#a6172f",
    },
  },
  }));

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

const Employees = ({ userToken }) => {
  const classes = useStyles();

  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(null);
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [tup, setTUP] = useState({});
  const [positions, setPositions] = useState({});
  const [employees, setEmployees] = useState([]);
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [deleteKey, setDeleteKey] = useState(null);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  useEffect(() => {
    setIsFetching(true);
    let url = "https://tup-payroll-default-rtdb.firebaseio.com";
    axios
      .all([
        axios.get("https://tup-payroll.herokuapp.com/api/employees"),
        axios.get(`${url}/tup.json`),
        axios.get(`${url}/positions.json`),
      ])
      .then(
        axios.spread((...response) => {
          setEmployees(response[0].data);
          setTUP(response[1].data);
          setPositions(response[2].data);
          setIsFetching(false);
        })
      )
      .catch((error) => {
        console.log(error);
        setIsFetching(false);
      });
  }, []);

  // Modal toggler.
  const handleOpen = () => {
    setEmployeeFormOpen(true);
  };
  const handleClose = () => {
    setIsUpdating(null);
    setValues(initialValues);
    setEmployeeFormOpen(false);
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

  const handleDelete = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };
    setIsLoading(true);
    axios
      .delete(
        `https://tup-payroll.herokuapp.com/api/employees/${deleteKey}`,
        config
      )
      .then(() => {
        let filteredEmployees = employees;
        filteredEmployees = filteredEmployees.filter(function (item) {
          return item._id !== deleteKey;
        });
        setEmployees(filteredEmployees);
        setIsLoading(false);

        setSnackMessage("Success delete!");
        handleSnackOpen();
        setDeleteKey(null);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };
  const handleEdit = (key) => {
    let item = employees.filter(function (employee) {
      return employee._id === key;
    })[0];
    setValues({
      firstName: item.firstName,
      lastName: item.lastName,
      gender: item.gender,
      campus: {
        name: item.campus,
        idx: tup.campuses.indexOf(item.campus),
      },
      college: {
        name: item.college,
        idx: tup.colleges[tup.campuses.indexOf(item.campus)].indexOf(
          item.college
        ),
      },
      department: {
        name: item.department,
        idx: tup.departments[tup.campuses.indexOf(item.campus)][
          tup.colleges[tup.campuses.indexOf(item.campus)].indexOf(item.college)
        ].indexOf(item.department),
      },
      isPartTime: item.isPartTime,
      email: item.email,
      contactInfo: item.contactInfo,
      address: item.address,
      birthDate: item.birthDate,
      positionTitle: item.position.title ? item.position.title : "",
      positionRate: item.position.rate ? item.position.rate : "",
      salary: parseFloat(item.salary),
    });
    setIsUpdating(key);
    handleOpen();
  };

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

  let csvData = employees.map((employee) => ({
    employeeId: '=""' + employee.employeeId + '""',
    firstName: employee.firstName,
    lastName: employee.lastName,
    positionTitle: employee.position.title,
    positionRate: employee.position.rate,
    isPartTime: employee.isPartTime ? "1" : "0",
    salary: employee.salary,
    campus: employee.campus,
    college: employee.college,
    department: employee.department,
    gender: employee.gender,
    email: employee.email,
    contactInfo: '=""' + employee.contactInfo + '""',
    address: employee.address,
    birthDate: employee.birthDate,
  }));

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

          <Fab
            className={classes.createButton}
            size="medium"
            color="primary"
            onClick={handleOpen}
          >
            <AddIcon />
          </Fab>
          <Button>
            <CSVLink
              data={csvData}
              filename={"employees-export.csv"}
              className="btn btn-primary"
              target="_blank"
            >
              Export Employee CSV
            </CSVLink>
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
        setOpen={handleClose}
      >
        <EmployeeForm
          handleFormClose={handleClose}
          employees={employees}
          setEmployees={setEmployees}
          values={values}
          setValues={setValues}
          tup={tup}
          positions={positions}
          isUpdating={isUpdating}
        />
      </Dialog>

      <TransitionsModal
        handleClose={DeleteClose}
        isModalOpen={deleteKey ? true : false}
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
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={DeleteClose}
                  startIcon={<CancelIcon />}
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

      <Snack
        open={isSnackOpen}
        message={snackMessage}
        handleClose={handleSnackClose}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userToken: state.auth.token,
  };
};

export default connect(mapStateToProps)(Employees);
