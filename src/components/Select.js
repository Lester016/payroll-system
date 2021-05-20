import {
  FormControl,
  InputLabel,
  Select as MaterialSelect,
  MenuItem,
} from "@material-ui/core";

export function Select({
  name,
  label,
  value,
  onChange,
  isDisabled,
  options,
}) {
  return (
    <FormControl disabled={isDisabled}>
      <InputLabel>{label}</InputLabel>
      <MaterialSelect
        label={label}
        name={name}
        value={value}
        defaultValue=""
        onChange={onChange}
      >
        {options &&
          options.map((item) => (
            <MenuItem key={item.toLowerCase()} value={item}>
              {item}
            </MenuItem>
          ))}
      </MaterialSelect>
    </FormControl>
  );
}
