import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Card, Grid, Typography } from "@material-ui/core";

import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import HelpIcon from "@material-ui/icons/Help";

import { Doughnut, Bar } from "react-chartjs-2";

// POSITION SET UP FOR POSITION CHART
const position = [
  { jobRole: "Dean", employeeCount: 80 },
  { jobRole: "Admin", employeeCount: 500 },
  { jobRole: "Teacher", employeeCount: 1500 },
  { jobRole: "Cleaner", employeeCount: 300 },
];

const positionData = {
  responsive: true,
  labels: [
    position[0].jobRole,
    position[1].jobRole,
    position[2].jobRole,
    position[3].jobRole,
  ],
  datasets: [
    {
      data: [
        position[0].employeeCount,
        position[1].employeeCount,
        position[2].employeeCount,
        position[3].employeeCount,
      ],
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
        "rgb(150, 26, 222)",
      ],
      hoverOffset: 4,
    },
  ],
};

const positionConfig = {
  plugins: {
    title: {
      display: true,
      text: "POSITIONS",
      font: {
        size: 20,
      },
    },
    legend: {
      labels: {
        boxHeight: 20,
        boxWidth: 25,
      },
      position: "bottom",
    },
  },
};

// PAYROLL BUDGET SET UP FOR BUDGET CHART
const budget = [
  { campus: "TUP-Manila", payroll: 3500200 },
  { campus: "TUP-Taguig", payroll: 2600600 },
  { campus: "TUP-Cavite", payroll: 2500600 },
  { campus: "TUP-Visayas", payroll: 1700520 },
];

const budgetData = {
  responsive: true,
  labels: [
    budget[0].campus,
    budget[1].campus,
    budget[2].campus,
    budget[3].campus,
  ],
  datasets: [
    {
      data: [
        budget[0].payroll,
        budget[1].payroll,
        budget[2].payroll,
        budget[3].payroll,
      ],
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
        "rgb(150, 26, 222)",
      ],
      hoverOffset: 4,
    },
  ],
};

const budgetConfig = {
  plugins: {
    title: {
      display: true,
      text: "PAYROLL BUDGET",
      font: {
        size: 20,
      },
    },
    legend: {
      labels: {
        boxHeight: 20,
        boxWidth: 25,
      },
      position: "bottom",
    },
  },
};

// COLLEGE SET UP FOR COLLEGE CHART
const college = [
  { department: "COS", employees: 350 },
  { department: "CAFA", employees: 100 },
  { department: "CLA", employees: 120 },
  { department: "CIT", employees: 100 },
  { department: "COE", employees: 150 },
  { department: "CIE", employees: 120 },
];

const collegeData = {
  labels: [
    college[0].department,
    college[1].department,
    college[2].department,
    college[3].department,
    college[4].department,
    college[5].department,
  ],
  datasets: [
    {
      maxBarThickness: 50,
      data: [
        college[0].employees,
        college[1].employees,
        college[2].employees,
        college[3].employees,
        college[4].employees,
        college[5].employees,
      ],
      backgroundColor: [
        "#FF4C4C",
        "#3DCC3D",
        "#4C4CFF",
        "#FFC04C",
        "#FFFF4C",
        "#CCCCCC",
      ],

      borderColor: [
        "#FF0000",
        "#008000",
        "#0000FF",
        "#FFA500",
        "#FFFF00",
        "#808080",
      ],
      borderWidth: 1,
    },
  ],
};

const collegeConfig = {
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "EMPLOYEE DISTRIBUTION AMONG COLLEGES",
      font: {
        size: 20,
      },
    },
  },
};

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

  const totalEmployees = 1050;
  const totalPayrollGiven = 500;

  return (
    <div className={classes.root}>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12} md={4} lg={3}>
          {/* Pie Chart */}
          <Grid item xs={12}>
            <Card className={classes.chart} style={{ marginBottom: "18%" }}>
              <div>
                <Doughnut data={budgetData} options={budgetConfig} />
              </div>
            </Card>
            <Card className={classes.chart}>
              <div>
                <Doughnut data={positionData} options={positionConfig} />
              </div>
            </Card>
          </Grid>
        </Grid>

        <Grid item md={12} xs={12} lg={9} container justify="center">
          {/* EMPLOYEE TEXT CARD */}
          <Grid xs={12} container spacing={3}>
            <Grid item xs={4}>
              <Card
                className={classes.textCard}
                style={{ backgroundColor: "rgb(255, 99, 132)" }}
              >
                <div className={classes.left}>
                  <Typography className={classes.cardTitle}>
                    {totalEmployees}
                  </Typography>
                  <Typography className={classes.cardDescription}>
                    Total Employees
                  </Typography>
                </div>
                <PeopleAltIcon className={classes.icon} />
              </Card>
            </Grid>
            {/* DUMMY TEXT CARD */}
            <Grid item xs={4}>
              <Card
                className={classes.textCard}
                style={{ backgroundColor: "rgb(54, 162, 235)" }}
              >
                <div className={classes.left}>
                  <Typography className={classes.cardTitle}>200</Typography>
                  <Typography className={classes.cardDescription}>
                    Total Dummies
                  </Typography>
                </div>
                <HelpIcon className={classes.icon} />
              </Card>
            </Grid>
            {/* PAYROLL TEXT CARD */}
            <Grid item xs={4}>
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
            </Grid>
          </Grid>
          {/* BAR CHART */}
          <Grid item xs={12}>
            <Card className={classes.barchart}>
              <div className={classes.left}>
                <Bar data={collegeData} options={collegeConfig} />
              </div>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
