import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import ComputerIcon from "@material-ui/icons/Computer";
import PaletteIcon from "@material-ui/icons/Palette";
import SettingsIcon from "@material-ui/icons/Settings";
import WorkIcon from "@material-ui/icons/Work";
import BuildIcon from "@material-ui/icons/Build";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";

import { Doughnut } from "react-chartjs-2";

const count = [
  { campus: "TUP-Manila", employees: 250 },
  { campus: "TUP-Taguig", employees: 130 },
  { campus: "TUP-Cavite", employees: 150 },
  { campus: "TUP-Visayas", employees: 120 },
];

const chartData = {
  responsive: true,
  labels: [count[0].campus, count[1].campus, count[2].campus, count[3].campus],
  datasets: [
    {
      data: [
        count[0].employees,
        count[1].employees,
        count[2].employees,
        count[3].employees,
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

const options = {
  plugins: {
    title: {
      display: true,
      text: "EMPLOYEE PERCENTAGE OF TUP CAMPUSES",
      font: {
        size: 30,
      },
      color: "green",
    },
    legend: {
      labels: {
        boxHeight: 30,
        boxWidth: 35,
      },
      position: "right",
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

    // backgroundColor: "green",
  },
  cardDescription: {
    fontSize: 15,
    color: "white",
    // backgroundColor: "blue",
  },

  cos: {
    display: "flex",
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    height: 200,

    backgroundColor: "#D44949",
  },

  cafa: {
    display: "flex",
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    height: 200,

    backgroundColor: "#D0B72B",
  },
  cla: {
    display: "flex",
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    height: 200,

    backgroundColor: "#4384E4",
  },
  cit: {
    display: "flex",
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    height: 200,

    backgroundColor: "#FF821C",
  },

  coe: {
    display: "flex",
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    height: 200,

    backgroundColor: "#21BA21",
  },

  cie: {
    display: "flex",
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    height: 200,

    backgroundColor: "#D638D8",
  },

  chartCard: {
    padding: theme.spacing(2),
    backgroundColor: "#F7F2F2",
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

  const college = [
    { department: "College of Science", employees: 350 },
    { department: "College of Architecture and Fine Arts", employees: 100 },
    { department: "College of Liberal Arts", employees: 120 },
    { department: "College of Industrial Technology", employees: 100 },
    { department: "College of Engineering", employees: 150 },
    { department: "College of Industrial Education", employees: 120 },
  ];

  return (
    <div className={classes.root}>
      <h1>Welcome, Admin!</h1>
      <Grid container spacing={3}>
        {/* COS */}
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.cos}>
            <div className={classes.left}>
              <Typography className={classes.cardDescription}>
                Employees
              </Typography>
              <Typography className={classes.cardTitle}>
                {college[0].employees}
              </Typography>
              <Typography className={classes.cardDescription}>
                {college[0].department}
              </Typography>
            </div>
            <ComputerIcon className={classes.icon} />
          </Card>
        </Grid>

        {/* CAFA */}
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.cafa}>
            <div className={classes.left}>
              <Typography className={classes.cardDescription}>
                Employees
              </Typography>
              <Typography className={classes.cardTitle}>
                {college[1].employees}
              </Typography>
              <Typography className={classes.cardDescription}>
                {college[1].department}
              </Typography>
            </div>
            <PaletteIcon className={classes.icon} />
          </Card>
        </Grid>

        {/* CLA */}
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.cla}>
            <div className={classes.left}>
              <Typography className={classes.cardDescription}>
                Employees
              </Typography>
              <Typography className={classes.cardTitle}>
                {college[2].employees}
              </Typography>
              <Typography className={classes.cardDescription}>
                {college[2].department}
              </Typography>
            </div>
            <WorkIcon className={classes.icon} />
          </Card>
        </Grid>

        {/* CIT */}
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.cit}>
            <div className={classes.left}>
              <Typography className={classes.cardDescription}>
                Employees
              </Typography>
              <Typography className={classes.cardTitle}>
                {college[3].employees}
              </Typography>
              <Typography className={classes.cardDescription}>
                {college[3].department}
              </Typography>
            </div>
            <BuildIcon className={classes.icon} />
          </Card>
        </Grid>

        {/* COE */}
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.coe}>
            <div className={classes.left}>
              <Typography className={classes.cardDescription}>
                Employees
              </Typography>
              <Typography className={classes.cardTitle}>
                {college[4].employees}
              </Typography>

              <Typography className={classes.cardDescription}>
                {college[4].department}
              </Typography>
            </div>
            <SettingsIcon className={classes.icon} />
          </Card>
        </Grid>

        {/* CIE */}
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.cie}>
            <div className={classes.left}>
              <Typography className={classes.cardDescription}>
                Employees
              </Typography>
              <Typography className={classes.cardTitle}>
                {college[5].employees}
              </Typography>
              <Typography className={classes.cardDescription}>
                {college[5].department}
              </Typography>
            </div>
            <QuestionAnswerIcon className={classes.icon} />
          </Card>
        </Grid>

        {/* CHART */}
        <Grid item xs={12} lg={8}>
          <Card className={classes.chartCard} style={{ position: "relative" }}>
            <div
              style={{
                height: "80%",
                width: "90%",
              }}
            >
              <Doughnut data={chartData} options={options} />
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
