import { TextField as MaterialTextField } from "@material-ui/core";

export default function TextField({
  variant,
  label,
  name,
  value,
  onChange,
  ...other
}) {
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
