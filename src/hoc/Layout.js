import { useState } from "react";
import { useLocation } from "react-router-dom";
// MaterialUI
import { makeStyles, List, Divider, CssBaseline } from "@material-ui/core";
import {
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  PersonAdd as PersonAddIcon,
  MoneyOff as MoneyOffIcon,
  AttachMoney as AttachMoneyIcon,
  Info as InfoIcon,
} from "@material-ui/icons";

import NavItem from "../components/Navigations/NavItem";
import Navbar from "../components/Navigations/Navbar";
import NavDrawer from "../components/Navigations/NavDrawer";
import { connect } from "react-redux";

const titleBar = {
  "/": "Dashboard",
  "/positions": "Positions",
  "/deductions": "Deductions",
  "/schedules": "Schedules",
  "/payroll": "Payroll",
  "/employees": "Employees",
  "/attendance": "Attendance",
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
  button: {
    backgroundColor: "#fff",
  },
}));

const Layout = ({ children, admin }) => {
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
        admin={admin}
      />

      <NavDrawer handleDrawerClose={handleDrawerClose} isOpen={open}>
        {/* Navigation Links */}
        <List className={classes.button}>
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
          <NavItem route={"/about"} title={"About"} IconComponent={InfoIcon} />
        </List>
      </NavDrawer>

      {/* Content */}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {children}
      </main>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    admin: state.auth.name,
  };
};

export default connect(mapStateToProps)(Layout);
