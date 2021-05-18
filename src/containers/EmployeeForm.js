import axios from "axios";
import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";

import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";

import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { makeStyles } from "@material-ui/core/styles";

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
  fullWidth: {
    width: "100%",
  },
}));

export default function EmployeeForm() {
  const classes = useStyle();

  const [isFetching, setIsFetching] = useState(false);
  const [gender, setGender] = useState("male");
  const [campus, setCampus] = useState({
      name: "",
      idx: -1,
  });
  const [college, setCollege] = useState({
    name: "",
    idx: -1,
});
  const [dept, setDept] = useState({
    name: "",
    idx: -1,
});
  const [type, setType] = useState("regular");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState(0);
  const [tup, setTUP] = useState({});

  const handleGender = (event) => {
    setGender(event.target.value);
  };
  const handleCampus = (event) => {
    setCampus({
        name: event.target.value,
        idx: tup.campuses.indexOf(event.target.value)
    });
  };
  const handleCollege = (event) => {
    setCollege({
        name: event.target.value,
        idx: tup.colleges[campus.idx].indexOf(event.target.value),
    });
  };
  const handleDept = (event) => {
    setDept({
        name: event.target.value,
        idx: tup.departments[campus.idx][college.idx].indexOf(event.target.value),
    });
  };
  const handleType = (event) => {
    setType(event.target.value);
  };
  const handlePosition = (event) => {
    setPosition(event.target.value);
    setSalary("");
  };

  // Get positions in the database
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

  const LoadingTUP = (
    <>
      <Grid item sm={12} md={6} lg={3}>
        <FormControl disabled>
          <InputLabel>Campus</InputLabel>
          <Select value={campus} onChange={handleCampus}></Select>
        </FormControl>
      </Grid>
      <Grid item sm={12} md={6} lg={3}>
        <FormControl disabled>
          <InputLabel>College</InputLabel>
          <Select value={college} onChange={handleCollege}></Select>
        </FormControl>
      </Grid>
      <Grid item sm={12} md={6} lg={3}>
        <FormControl disabled>
          <InputLabel>Department</InputLabel>
          <Select value={dept} onChange={handleDept}></Select>
        </FormControl>
      </Grid>
    </>
  );

  return (
    <Container component={Paper} className={classes.root}>
      <Grid container spacing={3}>
        {/*First Row - First Name, Last Name, Gender*/}
        <Grid item sm={12} md={4}>
          <TextField variant="outlined" label="First Name" />
        </Grid>
        <Grid item sm={12} md={4}>
          <TextField variant="outlined" label="Last Name" />
        </Grid>
        <Grid item sm={12} md={4}>
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup row name="gender1" value={gender} onChange={handleGender}>
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
          </RadioGroup>
        </Grid>

        {/*Second Row - Campus, College, Department, Type*/}
        {isFetching || Object.keys(tup).length === 0 ? (
          LoadingTUP
        ) : (
          <>
            <Grid item sm={12} md={6} lg={3}>
              <FormControl>
                <InputLabel>Campus</InputLabel>
                <Select value={campus.name} onChange={handleCampus}>
                  {tup.campuses.map((item) => (
                    <MenuItem value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={12} md={6} lg={3}>
              {campus.name === "" || campus.idx >= tup.colleges.length ? (
                <FormControl disabled>
                  <InputLabel>College</InputLabel>
                  <Select value={college.name} onChange={handleCollege}></Select>
                </FormControl>
              ) : (
                <FormControl>
                  <InputLabel>College</InputLabel>
                  <Select value={college.name} onChange={handleCollege}>
                    {tup.colleges[campus.idx].map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>                
              )}
            </Grid>
            <Grid item sm={12} md={6} lg={3}>
            {college.name === "" || (tup.departments[campus.idx] === undefined ? true : college.idx >= tup.departments[campus.idx].length) ? (
                <FormControl disabled>
                  <InputLabel>Department</InputLabel>
                  <Select value={dept.name} onChange={handleDept}></Select>
                </FormControl>
              ) : (
                <FormControl>
                  <InputLabel>Department</InputLabel>
                  <Select value={dept.name} onChange={handleDept}>
                    {tup.departments[campus.idx][college.idx].map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>
          </>
        )}
        <Grid item sm={12} md={6} lg={3}>
          <FormLabel component="legend">Type</FormLabel>
          <RadioGroup row name="type1" value={type} onChange={handleType}>
            <FormControlLabel
              value="regular"
              control={<Radio />}
              label="Regular"
            />
            <FormControlLabel
              value="part-timer"
              control={<Radio />}
              label="Part-timer"
            />
          </RadioGroup>
        </Grid>

        {/*Third Row - Address, Contact Info, Birthday*/}
        <Grid item sm={12} md={6}>
          <TextField variant="outlined" label="Address" />
        </Grid>
        <Grid item sm={12} md={3}>
          <TextField variant="outlined" label="Contact Number" />
        </Grid>
        <Grid item sm={12} md={3}>
          <TextField
            label="Birth Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        {/*Fourth Row - Address, Contact Info*/}
        <Grid item sm={12} md={4}>
          <InputLabel>Position</InputLabel>
          <Select value={position} onChange={handlePosition}>
            <MenuItem value="Assistant Professor I">
              Assistant Professor I
            </MenuItem>
          </Select>
        </Grid>
        <Grid item sm={12} md={4}>
          <Typography>
            <NumberFormat
              value={salary}
              displayType={"text"}
              thousandSeparator={true}
              prefix="₱"
            />
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
