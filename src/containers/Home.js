import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";

import { Doughnut, Bar } from "react-chartjs-2";

// GENDER SET UP FOR GENDER CHART
const gender = [
  { sex: "Male", count: 1560 },
  { sex: "Female", count: 1989 },
];

const genderData = {
  responsive: true,
  labels: [gender[0].sex, gender[1].sex],
  datasets: [
    {
      data: [gender[0].count, gender[1].count],
      backgroundColor: ["rgb(54, 162, 235)", "rgb(255, 99, 132)"],
      hoverOffset: 4,
    },
  ],
};

const genderConfig = {
  plugins: {
    title: {
      display: true,
      text: "GENDER",
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
      backgroundColor: ["red", "blue", "green", "gray"],
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

// BUDGET SET UP FOR BUDGET CHART
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
      text: "PAYROLL BUDGET FOR TUP CAMPUSES",
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
  { department: "College of Science", employees: 350 },
  { department: "College of Architecture and Fine Arts", employees: 100 },
  { department: "College of Liberal Arts", employees: 120 },
  { department: "College of Industrial Technology", employees: 100 },
  { department: "College of Engineering", employees: 150 },
  { department: "College of Industrial Education", employees: 120 },
];

const collegeData = {
  labels: ["COS", "CAFA", "CLA", "CIT", "COE", "CIE"],
  datasets: [
    {
      data: [
        college[0].employees,
        college[1].employees,
        college[2].employees,
        college[3].employees,
        college[4].employees,
        college[5].employees,
      ],
      backgroundColor: ["red", "green", "blue", "orange", "yellow", "gray"],
      borderColor: ["red", "green", "blue", "orange", "yellow", "gray"],
      borderWidth: 1,
    },
  ],
};

const collegeConfig = {
  plugins: {
    title: {
      display: true,
      text: "EMPLOYEE DISTRIBUTION",
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

  cardTitle: {
    fontSize: 60,
    color: "white",
    fontWeight: "bold",
  },

  cardDescription: {
    fontSize: 15,
    color: "white",
  },

  chart: {
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
  },

  left: {
    flex: 2,
  },

  icon: {
    fontSize: 100,
  },
}));

export default function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h1>Welcome, Admin!</h1>
      <Grid container spacing={3}>
        {/* GENDER CHART */}
        <Grid item xs={12} xs={12} sm={10} md={4}>
          <Card className={classes.chart}>
            <div className={classes.left} style={{ position: "relative" }}>
              <Doughnut data={genderData} options={genderConfig} />
            </div>
          </Card>
        </Grid>

        {/* PAYROLL CHART */}
        <Grid item xs={12} xs={12} sm={10} md={4}>
          <Card className={classes.chart}>
            <div className={classes.left} style={{ position: "relative" }}>
              <Doughnut data={budgetData} options={budgetConfig} />
            </div>
          </Card>
        </Grid>

        {/* POSITION CHART */}
        <Grid item xs={12} xs={12} sm={10} md={4}>
          <Card className={classes.chart}>
            <div className={classes.left} style={{ position: "relative" }}>
              <Doughnut data={positionData} options={positionConfig} />
            </div>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {/* BAR CHART */}
        <Grid item xs={12} sm={10} md={12}>
          <Card className={classes.chart}>
            <div className={classes.left} style={{ position: "relative" }}>
              <Bar data={collegeData} options={collegeConfig} />
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
