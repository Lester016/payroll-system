import {
  FormControl,
  InputLabel,
  Select as MaterialSelect,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";

const Select = ({ name, label, value, onChange, isDisabled, error = null, options }) => {
  return (
    <FormControl disabled={isDisabled} {...(error && { error: true })}>
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
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default Select;
