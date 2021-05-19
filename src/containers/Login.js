import { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import {
  Button,
  Paper,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import {
  Lock as LockIcon,
  PersonOutline as PersonOutlineIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";

import * as actions from "../store/actions";

const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginTop: 100,
  },

  paper: {
    textAlign: "center",
    width: 450,
  },
  field: {
    marginTop: 30,
    width: "80%",
    minWidth: 200,
  },
  button: {
    marginTop: 20,
    marginBottom: 30,
    width: "20%",
    minWidth: 100,
  },
});

const Login = ({ login, isAuthenticated, loading, error }) => {
  // Validations Schema.
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required().label("Email"),
    password: Yup.string().required().label("Password"),
  });

  const [showPassword, setShowPassword] = useState(false);
  const classes = useStyles();

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={(values) => {
        login(values.email, values.password);
      }}
    >
      {({ touched, errors }) => (
        <Form className={classes.container}>
          <Paper className={classes.paper}>
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
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              error={touched.password && errors.password !== undefined}
              helperText={touched.password && errors.password}
            />
            <Typography
              variant="subtitle1"
              style={{ marginTop: 15, color: "red" }}
            >
              {error ? error : null}
            </Typography>
            {loading ? (
              <CircularProgress color="secondary" />
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disableElevation
                className={classes.button}
              >
                Sign in
              </Button>
            )}
          </Paper>
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
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
