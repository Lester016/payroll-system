import React from "react";
import { TextField as MaterialTextField } from "@material-ui/core";

export default function TextField(props) {
  const { variant, label, name, value, onChange, ...other } = props;

  return (
    <MaterialTextField
      variant={variant}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...other}
    />
  );
}
