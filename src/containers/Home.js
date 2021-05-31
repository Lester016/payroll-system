import axios from "axios";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Card, Grid, Typography } from "@material-ui/core";

import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ScheduleIcon from "@material-ui/icons/Schedule";

import Skeleton from "@material-ui/lab/Skeleton";

import PayrollChart from "../components/Charts/PayrollChart";
import PositionChart from "../components/Charts/PositionChart";
import CollegeChart from "../components/Charts/CollegeChart";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  textCard: {
    display: "flex",
    marginBottom: 25,
    height: 137,
  },

  cardTitle: {
    fontSize: 50,
    color: "#ffffff",
    fontWeight: "bold",
  },

  cardDescription: {
    fontSize: 15,
    color: "#ffffff",
  },

  chart: {
    padding: theme.spacing(0),
  },

  barchart: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
  left: {
    flex: 3,
    margin: 10,
  },
  icon: {
    flex: 1,
    fontSize: 60,
    marginTop: 20,
    color: "white",
  },
}));

export default function Home() {
  const classes = useStyles();
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  let [partTimer, setPartTimer] = useState(0);

  const totalPayrollGiven = 500;

  const home = () => {
    setIsFetching(true);
    axios
      .get("https://tup-payroll.herokuapp.com/api/employees")
      .then((response) => {
        setIsFetching(false);
        setEmployees(response.data);
        setTotalEmployees(Object.keys(response.data).length);
        for (let dataObj of response.data) {
          if (dataObj.isPartTime === true) {
            setPartTimer((partTimer += 1));
          }
        }
      })
      .catch((e) => {
        setIsFetching(false);
        console.log("Error: ", e);
      });
  };
  // Get employees in the database
  useEffect(() => {
    home();
  }, []);

  return (
    <div className={classes.root}>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12} md={4} lg={3}>
          {/* Pie Chart */}
          <Grid item xs={12}>
            <Card className={classes.chart} style={{ marginBottom: "18%" }}>
              <div>
                {/* <Doughnut data={budgetData} options={budgetConfig} /> */}
                <PayrollChart />
              </div>
            </Card>
            <Card className={classes.chart}>
              <div>
                <PositionChart />
              </div>
            </Card>
          </Grid>
        </Grid>

        <Grid item md={12} xs={12} lg={9} container justify="center">
          {/* EMPLOYEE TEXT CARD */}
          <Grid xs={12} container spacing={3}>
            <Grid item xs={4}>
              {isFetching ? (
                <Skeleton />
              ) : (
                <Card
                  className={classes.textCard}
                  style={{ backgroundColor: "rgb(255, 99, 132)" }}
                >
                  <div className={classes.left}>
                    <Typography className={classes.cardTitle}>
                      {totalEmployees}
                    </Typography>

                    <Typography className={classes.cardDescription}>
                      Total Regular Employees
                    </Typography>
                  </div>
                  <PeopleAltIcon className={classes.icon} />
                </Card>
              )}
            </Grid>
            {/* PART TIMERS TEXT CARD */}
            <Grid item xs={4}>
              {isFetching ? (
                <Skeleton />
              ) : (
                <Card
                  className={classes.textCard}
                  style={{ backgroundColor: "rgb(54, 162, 235)" }}
                >
                  <div className={classes.left}>
                    {isFetching ? (
                      <Skeleton />
                    ) : (
                      <Typography className={classes.cardTitle}>
                        {partTimer}
                      </Typography>
                    )}

                    <Typography className={classes.cardDescription}>
                      Total Part-Timers
                    </Typography>
                  </div>
                  <ScheduleIcon className={classes.icon} />
                </Card>
              )}
            </Grid>
            {/* PAYROLL TEXT CARD */}
            <Grid item xs={4}>
              {isFetching ? (
                <Skeleton />
              ) : (
                <Card
                  className={classes.textCard}
                  style={{ backgroundColor: "rgb(255, 205, 86)" }}
                >
                  <div className={classes.left}>
                    <Typography className={classes.cardTitle}>
                      {totalPayrollGiven}
                    </Typography>
                    <Typography className={classes.cardDescription}>
                      Distributed Payroll
                    </Typography>
                  </div>
                  <AttachMoneyIcon className={classes.icon} />
                </Card>
              )}
            </Grid>
          </Grid>
          {/* BAR CHART */}
          <Grid item xs={12}>
            <Card className={classes.barchart}>
              <div className={classes.left}>
                <CollegeChart />
              </div>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
