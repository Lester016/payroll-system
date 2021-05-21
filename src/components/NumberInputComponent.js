import NumberFormat from "react-number-format";

const NumberInputComponent = ({ inputRef, onChange, name, ...other }) => {
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: name,
            value: values.value,
          },
        });
      }}
      thousandSeparator={true}
      prefix={"₱"}
    />
  );
};

export default NumberInputComponent;
