import { useState } from "react";
import { useLocation } from "react-router-dom";

import NavItem from "../components/Navigations/NavItem";
import Navbar from "../components/Navigations/Navbar";
import NavDrawer from "../components/Navigations/NavDrawer";

// MaterialUI
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import CssBaseline from "@material-ui/core/CssBaseline";
import DashboardIcon from "@material-ui/icons/Dashboard";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import GroupIcon from "@material-ui/icons/Group";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import MoneyOffIcon from "@material-ui/icons/MoneyOff";
import ScheduleIcon from "@material-ui/icons/Schedule";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

const titleBar = {
  "/": "Dashboard",
  "/positions": "Positions",
  "/deductions": "Deductions",
  "/schedules": "Schedules",
  "/payroll": "Payroll",
  "/employees": "Employees",
  "/attendance": "Attendance",
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBarSpacer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 2,
    padding: theme.spacing(3),
  },
}));

export default function Layout({ children }) {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />

      {/* AppBar */}
      <Navbar
        handleDrawerOpen={handleDrawerOpen}
        isOpen={open}
        title={titleBar[useLocation().pathname]}
      />

      <NavDrawer handleDrawerClose={handleDrawerClose} isOpen={open}>
        {/* Navigation Links */}
        <List>
          <NavItem
            route={"/"}
            title={"Dashboard"}
            IconComponent={DashboardIcon}
          />
          <Divider />
          <NavItem
            route={"/attendance"}
            title={"Attendance"}
            IconComponent={CalendarTodayIcon}
          />
          <NavItem
            route={"/employees"}
            title={"Employees"}
            IconComponent={GroupIcon}
          />
          <NavItem
            route={"/positions"}
            title={"Positions"}
            IconComponent={PersonAddIcon}
          />
          <NavItem
            route={"/deductions"}
            title={"Deductions"}
            IconComponent={MoneyOffIcon}
          />
          <Divider />
          <NavItem
            route={"/schedules"}
            title={"Schedules"}
            IconComponent={ScheduleIcon}
          />
          <NavItem
            route={"/payroll"}
            title={"Payroll"}
            IconComponent={AttachMoneyIcon}
          />

          <Divider />
        </List>
      </NavDrawer>

      {/* Content */}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {children}
      </main>
    </div>
  );
}
