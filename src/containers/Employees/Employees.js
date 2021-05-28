import axios from "axios";
import { CSVLink } from "react-csv";
import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Toolbar,
  Button,
  InputAdornment,
} from "@material-ui/core";
import { Add as AddIcon, Search as SearchIcon } from "@material-ui/icons";

import EmployeeForm from "./EmployeeForm";
import Table from "../../components/Table";
import TextField from "../../components/TextField";
import Dialog from "../../components/Dialog";

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

const Employees = () => {
  const [isFetching, setIsFetching] = useState(false);
  //const [isLoading, setIsLoading] = useState(false);
  //const [isUpdating, setIsUpdating] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false);
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
    setEmployeeFormOpen(false);
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

  let csvData = employees.map(employee => ({
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
    birthDate: employee.birthDate.substr(0, 10),
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
              Download me
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
        <EmployeeForm handleFormClose={handleClose} />
        {/*employees={employees}
          setEmployees={setEmployees}
          tup={tup}
          positions={positions}
          values={values}
          setValues={setValues}
          errors={errors}
          setErrors={setErrors}
          onSubmit={handleSubmit}
          onEdit={handleEdit}
          onReset={handleReset}
          isFetching={isFetching}
        */}
      </Dialog>
    </>
  );
};

export default Employees;
