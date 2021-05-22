import axios from "axios";
import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";
import AddIcon from "@material-ui/icons/Add";
import { KeyboardDatePicker } from "@material-ui/pickers";
import {
  makeStyles,
  Container,
  Grid,
  Typography,
  Button,
} from "@material-ui/core";

import TextField from "../../components/TextField";
import RadioGroup from "../../components/RadioGroup";
import Select from "../../components/Select";
import Snack from "../../components/Snack";

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
  button: {
    margin: theme.spacing(0, 1),
  },
}));

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

const genderItems = [
  { id: "male", title: "Male" },
  { id: "female", title: "Female" },
  { id: "other", title: "Other" },
];

const typeItems = [
  { id: "regular", title: "Regular" },
  { id: "part-timer", title: "Part-Timer" },
];

const EmployeeForm = ({ handleFormClose }) => {
  const classes = useStyle();

  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(null);
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [tup, setTUP] = useState({});
  const [positions, setPositions] = useState({});
  const [employees, setEmployees] = useState({});
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // Get TUP & Positions in the database
  useEffect(() => {
    setIsFetching(true);
    let url = "https://tup-payroll-default-rtdb.firebaseio.com";
    axios
      .all([
        axios.get(`${url}/tup.json`),
        axios.get(`${url}/positions.json`),
        axios.get("https://tup-payroll.herokuapp.com/api/employees"),
      ])
      .then(
        axios.spread((...response) => {
          setTUP(response[0].data);
          setPositions(response[1].data);
          setEmployees(response[2].data);
          setIsFetching(false);
        })
      )
      .catch((error) => {
        console.log(error);
        setIsFetching(false);
      });
  }, []);

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
      dept: {
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
      dept: {
        name: "",
        idx: -1,
      },
    });
  };

  const handleDept = (event) => {
    setValues({
      ...values,
      dept: {
        name: event.target.value,
        idx: tup.departments[values.campus.idx][values.college.idx].indexOf(
          event.target.value
        ),
      },
    });
  };

  const handleType = (event) => {
    setValues({ ...values, type: event.target.value });
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
    temp.dept = fieldValues.dept.name ? "" : "This field is required.";
    temp.email = /\S+@\S+\.\S+/.test(fieldValues.email.trim())
      ? ""
      : "Email adress is invalid.";
    temp.address = fieldValues.address.trim() ? "" : "This field is required.";
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
          .post("https://tup-payroll.herokuapp.com/api/employees", postItem)
          .then((response) => {
            // Submit the position to the existings positions list.
            setEmployees({
              ...employees,
              postItem,
            });
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
  const handleReset = () => {
    setValues(initialValues);
    setErrors({});
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
              values={values.firstName}
              onBlur={(e) =>
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
              values={values.lastName}
              onBlur={(e) => setValues({ ...values, lastName: e.target.value })}
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
                    error={errors.dept}
                  />
                ) : (
                  <Select
                    name="department"
                    label="Department"
                    value={values.dept.name}
                    onChange={handleDept}
                    options={
                      tup.departments[values.campus.idx][values.college.idx]
                    }
                    error={errors.dept}
                  />
                )}
              </Grid>
            </>
          )}
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <RadioGroup
              name="type"
              label="Type"
              value={values.type}
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
              onBlur={(e) => setValues({ ...values, email: e.target.value })}
              error={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <TextField
              variant="outlined"
              label="Contact Number"
              name="contactInfo"
              onBlur={(e) =>
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
              onBlur={(e) => setValues({ ...values, address: e.target.value })}
              error={errors.address}
            />
          </Grid>

          {/*Fifth Row - Position & Salary*/}
          <Grid item xs={12} sm={12} md={4}>
            {isFetching || Object.keys(positions).length === 0 ? (
              <Select
                name="position"
                label="Position"
                value=""
                isDisabled={true}
              />
            ) : (
              <Select
                name="position"
                label="Position"
                value={values.positionTitle}
                onChange={handlePosition}
                options={Object.values(positions).map((item) => item.title)}
                error={errors.positionTitle}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Typography>
              <NumberFormat
                value={values.positionRate}
                displayType={"text"}
                thousandSeparator={true}
                prefix="₱"
              />
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleSubmit}
              className={classes.button}
            >
              Create New
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={handleFormClose}
              className={classes.button}
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

export default EmployeeForm;
