import { useState } from "react";
import { useLocation } from "react-router-dom";

// MaterialUI
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import NavItem from "../components/Navigations/NavItem";
import MailIcon from "@material-ui/icons/Mail";
import Navbar from "../components/Navigations/Navbar";
import NavDrawer from "../components/Navigations/NavDrawer";

const titleBar = {
  "/": "Home",
  "/positions": "Positions",
  "/deductions": "Deductions",
  "/schedules": "Schedules",
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
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
          <NavItem route={"/"} title={"Home"} IconComponent={MailIcon} />
          <NavItem
            route={"/positions"}
            title={"Positions"}
            IconComponent={MailIcon}
          />
          <NavItem
            route={"/deductions"}
            title={"Deductions"}
            IconComponent={MailIcon}
          />
          <NavItem
            route={"/schedules"}
            title={"Schedules"}
            IconComponent={MailIcon}
          />
        </List>
      </NavDrawer>

      {/* Content */}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}
