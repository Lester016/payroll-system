import React from 'react';
import { TextField as MaterialTextField } from "@material-ui/core";

const TextField = ({ variant, label, name, value, onChange, error = null, ...other }) => {
  return (
    <MaterialTextField
      variant={variant}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  );
};

export default TextField;
