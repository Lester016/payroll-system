import NumberFormat from "react-number-format";

const NumberInputComponent = (props) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
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
