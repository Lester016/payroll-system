import {
  RadioGroup as MaterialRadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@material-ui/core";

export default function RadioGroup({ name, label, value, onChange, items }) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <MaterialRadioGroup row name={name} value={value} onChange={onChange}>
        {items.map((item) => (
          <FormControlLabel
            key={item.id}
            value={item.id}
            control={<Radio />}
            label={item.title}
          />
        ))}
      </MaterialRadioGroup>
    </FormControl>
  );
}
