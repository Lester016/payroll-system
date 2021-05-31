import axios from "axios";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import NumberFormat from "react-number-format";
import { KeyboardDatePicker } from "@material-ui/pickers";
import {
  makeStyles,
  Container,
  Grid,
  Typography,
  Button,
} from "@material-ui/core";
import { Add as AddIcon, Cancel as CancelIcon } from "@material-ui/icons";

import TextField from "../../components/TextField";
import RadioGroup from "../../components/RadioGroup";
import Select from "../../components/Select";
import Snack from "../../components/Snack";
import NumberInputComponent from "../../components/NumberInputComponent";

const useStyle = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiFormControl-root": {
      width: "100%",
    },
    "& .MuiInputBase-root": {
      width: "100%",
    },
  },
  chipsContainer: {
    display: "flex",
    minHeight: "100px",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  createButton: {
    margin: theme.spacing(0, 1),
    borderRadius: 15,
    marginRight: 5,
    backgroundColor: "#bf1d38",
    "&:hover": {
      backgroundColor: "#a6172f",
    },
  },
  cancelButton: {
    margin: theme.spacing(0, 1),
    borderRadius: 15,
    marginRight: 5,
    backgroundColor: "#8388a5",
    "&:hover": {
      backgroundColor: "#5f6484",
    },
  },
  hidden: {
    visibility: "hidden",
  },
}));

const genderItems = [
  { id: "male", title: "Male", value: "M" },
  { id: "female", title: "Female", value: "F" },
  { id: "other", title: "Other", value: "O" },
];

const typeItems = [
  { id: "regular", title: "Regular", value: false },
  { id: "part-timer", title: "Part-Timer", value: true },
];

const EmployeeForm = ({
  userToken,
  handleFormClose,
  employees,
  setEmployees,
  values,
  setValues,
  tup,
  positions,
  isUpdating,
}) => {
  const classes = useStyle();

  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [errors, setErrors] = useState({});

  // EMPLOYEE FORM INPUT FIELDS HANDLES
  const handleGender = (event) => {
    setValues({ ...values, gender: event.target.value });
  };

  const handleCampus = (event) => {
    setValues({
      ...values,
      campus: {
        name: event.target.value,
        idx: tup.campuses.indexOf(event.target.value),
      },
      college: {
        name: "",
        idx: -1,
      },
      department: {
        name: "",
        idx: -1,
      },
    });
  };

  const handleCollege = (event) => {
    setValues({
      ...values,
      college: {
        name: event.target.value,
        idx: tup.colleges[values.campus.idx].indexOf(event.target.value),
      },
      department: {
        name: "",
        idx: -1,
      },
    });
  };

  const handleDept = (event) => {
    setValues({
      ...values,
      department: {
        name: event.target.value,
        idx: tup.departments[values.campus.idx][values.college.idx].indexOf(
          event.target.value
        ),
      },
    });
  };

  const handleType = (event) => {
    setValues({
      ...values,
      isPartTime: event.target.value === "true",
    });
  };

  const handlePosition = (event) => {
    const foundPosition = Object.values(positions).find(
      (x) => x.title === event.target.value
    );
    setValues({
      ...values,
      positionTitle: foundPosition.title,
      positionRate: foundPosition.rate,
    });
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
    temp.department = fieldValues.department.name
      ? ""
      : "This field is required.";
    temp.email = /\S+@\S+\.\S+/.test(fieldValues.email.trim())
      ? ""
      : "Email adress is invalid.";
    temp.address = fieldValues.address.trim() ? "" : "This field is required.";
    temp.contactInfo =
      fieldValues.contactInfo.toString().length === 11
        ? ""
        : "Contact Number must be 11 digits.";
    if (fieldValues.isPartTime === false) {
      temp.positionTitle = fieldValues.positionTitle
        ? ""
        : "This field is required.";
      temp.salary = fieldValues.salary ? "" : "This field is required.";
    }

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const zeroPad = (num, places) => String(num).padStart(places, "0");

  // EMPLOYEE FORM HANDLES
  const handleSubmit = (e) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    let employeeId = `${values.campus.idx}${values.college.idx}${zeroPad(
      values.department.idx,
      2
    )}`;
    if (validate()) {
      setIsLoading(true);
      let postItem =
        values.isPartTime === true
          ? {
              image: "/images/default.jpg",
              employeeId: employeeId,
              firstName: values.firstName,
              lastName: values.lastName,
              gender: values.gender,
              campus: values.campus.name,
              college: values.college.name,
              department: values.department.name,
              isPartTime: values.isPartTime ? true : false,
              email: values.email,
              contactInfo: values.contactInfo,
              address: values.address,
              birthDate: values.birthDate,
            }
          : {
              image: "/images/default.jpg",
              employeeId: employeeId,
              firstName: values.firstName,
              lastName: values.lastName,
              gender: values.gender,
              campus: values.campus.name,
              college: values.college.name,
              department: values.department.name,
              isPartTime: values.isPartTime ? true : false,
              email: values.email,
              contactInfo: values.contactInfo,
              address: values.address,
              birthDate: values.birthDate,
              position: {
                title: values.positionTitle,
                rate: parseFloat(values.positionRate),
              },
              salary: parseFloat(values.salary),
            };
      if (isUpdating === null) {
        // Submit new employee
        axios
          .post(
            "https://tup-payroll.herokuapp.com/api/employees",
            postItem,
            config
          )
          .then((response) => {
            // Submit the employee to the existings employees list.
            setEmployees([...employees, response.data]);
            setIsLoading(false);

            // Close modal
            handleFormClose();

            // Open snackbar
            setSnackMessage("Success submit!");
            handleSnackOpen();
          })
          .catch((error) => {
            // Log the error if found || catched.
            console.log(error);
            setIsLoading(false);

            // Close modal
            handleFormClose();
          });
        e.preventDefault();
      } else {
        // Submit new employee
        axios
          .put(
            `https://tup-payroll.herokuapp.com/api/employees/${isUpdating}`,
            postItem,
            config
          )
          .then((response) => {
            // Submit the employee to the existings employees list.
            let elementIdx = employees.findIndex(
              (employee) => employee._id === isUpdating
            );
            let updatedEmployees = Array.from(employees);
            updatedEmployees[elementIdx] = response.data;
            setEmployees(updatedEmployees);
            setIsLoading(false);

            // Close modal
            handleFormClose();

            // Open snackbar
            setSnackMessage("Success submit!");
            handleSnackOpen();
          })
          .catch((error) => {
            // Log the error if found || catched.
            console.log(error);
            setIsLoading(false);

            // Close modal
            handleFormClose();
          });
        e.preventDefault();
      }
    }
  };

  const LoadingTUP = (
    <>
      <Grid item xs={12} sm={12} md={6} lg={3}>
        <Select name="campus" label="Campus" value="" isDisabled={true} />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={3}>
        <Select name="college" label="College" value="" isDisabled={true} />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={3}>
        <Select
          name="department"
          label="Department"
          value=""
          isDisabled={true}
        />
      </Grid>
    </>
  );

  return (
    <>
      <Container className={classes.root}>
        <Grid container spacing={3} justify="center" alignItems="center">
          {/*First Row - First Name, Last Name, Gender*/}
          <Grid item xs={12} sm={12} md={4}>
            <TextField
              variant="outlined"
              label="First Name"
              name="firstName"
              value={values.firstName}
              onChange={(e) =>
                setValues({ ...values, firstName: e.target.value })
              }
              error={errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <TextField
              variant="outlined"
              label="Last Name"
              name="lastName"
              value={values.lastName}
              onChange={(e) =>
                setValues({ ...values, lastName: e.target.value })
              }
              error={errors.lastName}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <RadioGroup
              name="gender"
              label="Gender"
              value={values.gender}
              onChange={handleGender}
              items={genderItems}
            />
          </Grid>

          {/*Second Row - Campus, College, Department, Type*/}
          {isFetching || Object.keys(tup).length === 0 ? (
            LoadingTUP
          ) : (
            <>
              <Grid item xs={12} sm={12} md={6} lg={3}>
                <Select
                  name="campus"
                  label="Campus"
                  value={values.campus.name}
                  onChange={handleCampus}
                  options={tup.campuses}
                  error={errors.campus}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={3}>
                {values.campus.name === "" ||
                values.campus.idx >= tup.colleges.length ? (
                  <Select
                    name="college"
                    label="College"
                    value=""
                    onChange={handleCollege}
                    isDisabled={true}
                    error={errors.college}
                  />
                ) : (
                  <Select
                    name="college"
                    label="College"
                    value={values.college.name}
                    onChange={handleCollege}
                    options={tup.colleges[values.campus.idx]}
                    error={errors.college}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={3}>
                {values.college.name === "" ||
                (tup.departments[values.campus.idx] === undefined
                  ? true
                  : values.college.idx >=
                    tup.departments[values.campus.idx].length) ? (
                  <Select
                    name="department"
                    label="Department"
                    value=""
                    onChange={handleDept}
                    isDisabled={true}
                    error={errors.department}
                  />
                ) : (
                  <Select
                    name="department"
                    label="Department"
                    value={values.department.name}
                    onChange={handleDept}
                    options={
                      tup.departments[values.campus.idx][values.college.idx]
                    }
                    error={errors.department}
                  />
                )}
              </Grid>
            </>
          )}
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <RadioGroup
              name="type"
              label="Type"
              value={values.isPartTime}
              onChange={handleType}
              items={typeItems}
            />
          </Grid>

          {/*Third Row - Address, Contact Info, Birthday*/}
          <Grid item xs={12} sm={12} md={6}>
            <TextField
              variant="outlined"
              label="Email"
              name="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              error={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <TextField
              variant="outlined"
              label="Contact Number"
              name="contactInfo"
              value={values.contactInfo}
              onChange={(e) =>
                setValues({ ...values, contactInfo: e.target.value })
              }
              error={errors.contactInfo}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <KeyboardDatePicker
              autoOk
              disableFuture
              variant="inline"
              inputVariant="outlined"
              label="Birth Date"
              format="MM/dd/yyyy"
              value={values.birthDate}
              InputAdornmentProps={{ position: "start" }}
              onChange={(e) => setValues({ ...values, birthDate: e })}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant="outlined"
              label="Address"
              name="address"
              value={values.address}
              onChange={(e) =>
                setValues({ ...values, address: e.target.value })
              }
              error={errors.address}
            />
          </Grid>

          {/*Fifth Row - Position, Rate, & Salary*/}
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            className={values.isPartTime ? classes.hidden : ""}
          >
            <Select
              name="position"
              label="Position"
              value={values.positionTitle}
              onChange={handlePosition}
              options={Object.values(positions).map((item) => item.title)}
              error={errors.positionTitle}
              isDisabled={
                isFetching || Object.keys(positions).length === 0 ? true : false
              }
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={2}
            className={values.isPartTime ? classes.hidden : ""}
          >
            <Typography>
              {`Rate: ${!values.positionRate ? "None" : ""}`}
              <NumberFormat
                value={values.positionRate}
                displayType={"text"}
                thousandSeparator={true}
                prefix="₱"
              />
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            className={values.isPartTime ? classes.hidden : ""}
          >
            <TextField
              variant="outlined"
              label="Salary"
              name="Salary"
              value={values.salary}
              onChange={(e) => setValues({ ...values, salary: e.target.value })}
              InputProps={{
                inputComponent: NumberInputComponent,
              }}
              error={errors.salary}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleSubmit}
              className={classes.createButton}
            >
              Create
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={handleFormClose}
              className={classes.cancelButton}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Container>

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

export default connect(mapStateToProps)(EmployeeForm);
