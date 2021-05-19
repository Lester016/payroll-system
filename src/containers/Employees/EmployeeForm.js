import axios from "axios";
import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";

import {
  Container,
  Paper,
  Grid,
  Typography,
  Fab,
  Chip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { KeyboardDatePicker } from "@material-ui/pickers";

import TextField from "../../components/TextField";
import RadioGroup from "../../components/RadioGroup";
import Select from "../../components/Select";

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
    justifyContent: "flex-start",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

const genderItems = [
  { id: "male", title: "Male" },
  { id: "female", title: "Female" },
  { id: "other", title: "Other" },
];

const typeItems = [
  { id: "regular", title: "Regular" },
  { id: "part-timer", title: "Part-Timer" },
];

export default function EmployeeForm() {
  const classes = useStyle();

  const [isFetching, setIsFetching] = useState(false);
  const [tup, setTUP] = useState({});
  const [positions, setPositions] = useState({});
  const [values, setValues] = useState({
    firstName: "",
    lastname: "",
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
    address: "",
    contactInfo: "",
    birthDate: new Date(),
    position: "",
    salary: 0,
    deductions: {},
  });

  // Get tup in the database
  useEffect(() => {
    setIsFetching(true);
    axios
      .get("https://tup-payroll-default-rtdb.firebaseio.com/tup.json")
      .then((response) => {
        setTUP(response.data);
        setIsFetching(false);
      })
      .catch((error) => {
        console.log(error);
        setIsFetching(false);
      });
  }, []);

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

  // Employee Form Handles
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
    });
  };
  const handleCollege = (event) => {
    setValues({
      ...values,
      college: {
        name: event.target.value,
        idx: tup.colleges[values.campus.idx].indexOf(event.target.value),
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
      position: foundPosition.title,
      salary: foundPosition.rate,
    });
  };
  // Deduction Chip Handles
  const handleChipClick = () => {
    console.info("You clicked the Chip.");
  };
  const handleChipDelete = () => {
    console.info("You clicked the delete icon.");
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

  let DummyChips = [];
  for (let i = 0; i < 8; i++) {
    DummyChips.push(
      <Chip
        key={i}
        label="Clickable deletable"
        onClick={handleChipClick}
        onDelete={handleChipDelete}
      />
    );
  }

  return (
    <Container component={Paper} className={classes.root}>
      <Grid container spacing={3}>
        {/*First Row - First Name, Last Name, Gender*/}
        <Grid item xs={12} sm={12} md={4}>
          <TextField
            variant="outlined"
            label="First Name"
            name="firstName"
            onChange={(e) =>
              setValues({ ...values, firstName: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <TextField
            variant="outlined"
            label="Last Name"
            name="lastName"
            onChange={(e) => setValues({ ...values, lastName: e.target.value })}
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
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              {values.campus.name === "" ||
              values.campus.idx >= tup.colleges.length ? (
                <Select
                  name="college"
                  label="College"
                  value=""
                  isDisabled={true}
                />
              ) : (
                <Select
                  name="college"
                  label="College"
                  value={values.college.name}
                  onChange={handleCollege}
                  options={tup.colleges[values.campus.idx]}
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
                  isDisabled={true}
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
            label="Address"
            name="address"
            onChange={(e) => setValues({ ...values, address: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <TextField
            variant="outlined"
            label="Contact Number"
            name="contactInfo"
            onChange={(e) =>
              setValues({ ...values, contactInfo: e.target.value })
            }
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

        {/*Fourth Row - Address, Contact Info*/}
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
              value={values.position}
              onChange={handlePosition}
              options={Object.values(positions).map((item) => item.title)}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Typography>
            <NumberFormat
              value={values.salary}
              displayType={"text"}
              thousandSeparator={true}
              prefix="₱"
            />
          </Typography>
        </Grid>

        {/*Bottom Part - Deductions*/}
        <Grid item xs={12}>
          <Paper elevation={4}>
            <Grid container alignItems="center">
              <Grid item>
                <Typography variant="h6">Deductions</Typography>
              </Grid>
              <Grid item>
                <Fab color="primary" aria-label="add">
                  <AddIcon />
                </Fab>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.chipsContainer}>{DummyChips}</div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
