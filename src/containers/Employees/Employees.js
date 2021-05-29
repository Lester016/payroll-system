import axios from "axios";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { CSVLink } from "react-csv";
import {
  Container,
  Paper,
  Toolbar,
  Button,
  CircularProgress,
  InputAdornment,
} from "@material-ui/core";
import { Add as AddIcon, Search as SearchIcon, Delete as DeleteIcon, Cancel as CancelIcon } from "@material-ui/icons";

import EmployeeForm from "./EmployeeForm";
import Table from "../../components/Table";
import TextField from "../../components/TextField";
import Dialog from "../../components/Dialog";
import TransitionsModal from "../../components/Modal";
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

const Employees = ({userToken}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(null);
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false);
  const [deleteKey, setDeleteKey] = useState(null);
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

  // Modal toggler.
  const handleOpen = () => {
    setEmployeeFormOpen(true);
  };
  const handleClose = () => {
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
        `https://tup-payroll.herokuapp.com/api/employees/${deleteKey}`, config
      )
      .then(() => {
        let filteredEmployees = employees;
        filteredEmployees = filteredEmployees.filter(function(item) {return item._id !== deleteKey})
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

          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Create New
          </Button>
          <Button>
            <CSVLink
              data={csvData}
              filename={"my-file.csv"}
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
        setOpen={() => setEmployeeFormOpen(false)}
      >
        <EmployeeForm handleFormClose={handleClose} employees={employees} setEmployees={setEmployees}/>
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
                startIcon={<DeleteIcon/>}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={DeleteClose}
                startIcon={<CancelIcon/>}
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