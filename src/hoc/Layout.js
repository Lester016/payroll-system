import { useState } from "react";
import { useLocation } from "react-router-dom";
// MaterialUI
import { makeStyles, List, Divider, CssBaseline } from "@material-ui/core";
import {
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  PersonAdd as PersonAddIcon,
  MoneyOff as MoneyOffIcon,
  Schedule as ScheduleIcon,
  AttachMoney as AttachMoneyIcon,
} from "@material-ui/icons";

import NavItem from "../components/Navigations/NavItem";
import Navbar from "../components/Navigations/Navbar";
import NavDrawer from "../components/Navigations/NavDrawer";

const titleBar = {
  "/": "Dashboard",
  "/positions": "Positions",
  "/deductions": "Deductions",
  "/schedules": "Schedules",
  "/payroll": "Payroll",
  "/employees": "Employees",
  "/attendance": "Attendance",
  "/help": "Help",
  "/about": "About",
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
            route={"/payroll"}
            title={"Payroll"}
            IconComponent={AttachMoneyIcon}
          />

          <Divider />

          <NavItem
            route={"/help"}
            title={"Help"}
            IconComponent={ScheduleIcon}
          />
          <NavItem
            route={"/about"}
            title={"About"}
            IconComponent={ScheduleIcon}
          />
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
