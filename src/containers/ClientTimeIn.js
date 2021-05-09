import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { connect } from "react-redux";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  field: {},
  button: {},
});

const ClientTimeIn = () => {
  // Validations Schema.
  const TimeInSchema = Yup.object().shape({
    userID: Yup.string().required().label("Employee ID"),
  });

  const classes = useStyles();

  return (
    <Formik
      initialValues={{ userID: "" }}
      validationSchema={TimeInSchema}
      onSubmit={(values) => {
        alert(values.userID);
      }}
    >
      {({ touched, errors }) => (
        <Form>
          <h1>Client Time In Screen</h1>
          <Field
            type="text"
            name="userID"
            as={TextField}
            variant="outlined"
            label="Employee ID"
            className={classes.field}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <PersonOutlineIcon />
                </InputAdornment>
              ),
            }}
            error={touched.userID && errors.userID !== undefined}
            helperText={touched.userID && errors.userID}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disableElevation
            className={classes.button}
          >
            Time in
          </Button>
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientTimeIn);
