import { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { connect } from "react-redux";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import LockIcon from "@material-ui/icons/Lock";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import * as actions from "../store/actions";

const useStyles = makeStyles({
  field: {},
  button: {},
});

const Login = ({ login }) => {
  // Validations Schema.
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required().label("Email"),
    password: Yup.string().required().label("Password"),
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const classes = useStyles();

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={(values) => {
        login(values.email, values.password);
        alert(values.email, values.password);
      }}
    >
      {({ touched, errors }) => (
        <Form>
          <h1>Login Screen</h1>

          <Field
            as={TextField}
            type="email"
            name="email"
            variant="outlined"
            label="Email"
            className={classes.field}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <PersonOutlineIcon />
                </InputAdornment>
              ),
            }}
            error={touched.email && errors.email !== undefined}
            helperText={touched.email && errors.email}
          />

          <Field
            type={showPassword ? "text" : "password"}
            name="password"
            as={TextField}
            variant="outlined"
            label="Password"
            className={classes.field}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                  <LockIcon />
                </InputAdornment>
              ),
            }}
            error={touched.password && errors.password !== undefined}
            helperText={touched.password && errors.password}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disableElevation
            className={classes.button}
          >
            Sign in
          </Button>
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (email, password) => {
      dispatch(actions.login(email, password));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
