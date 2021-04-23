import React from "react";
import { Link } from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const NavItem = ({ route, title, IconComponent }) => {
  return (
    <ListItem button component={Link} to={route}>
      {IconComponent && <ListItemIcon>{<IconComponent />}</ListItemIcon>}
      <ListItemText primary={title} />
    </ListItem>
  );
};

export default NavItem;
