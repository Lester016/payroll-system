import { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import tupGif from '../asset/tupGif.gif';
import tupLogo from '../asset/tupLogo.png';
import {
  Button,
  Paper,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import {
  Lock as LockIcon,
  PersonOutline as PersonOutlineIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";

import * as actions from "../store/actions";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "85vh",
  },
  image: {
    backgroundImage: "url("+ tupGif +")",
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '3px',
  },
  form: {
    // textAlign: "center",
    // width: 450,
    margin: theme.spacing(6, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  field: {
    marginTop: 30,
    width: "80%",
    minWidth: 200,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#bf1d38",
    "&:hover": {
      backgroundColor: "#a6172f",
    },
  },
  paper: {
    marginTop: "40px",
    margin: theme.spacing(8),
  },
  progressBar: {
    color: "#bf1d38",
    marginTop: 10,
  },
}));

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
    <Paper className={classes.paper} elevation={20}>
      <Grid container component="main" className={classes.root}>
        <Grid item xs={false} sm={true} md={7} className={classes.image} />
        <Grid item xs={12} sm={12} md={5} component={Paper} elevation={0}>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            login(values.email, values.password);
          }}
        >
          {({ touched, errors }) => (
            <Form className={classes.form}>
                <img src={tupLogo} alt="logo" width='100'></img>
                <h1>Welcome back!</h1>
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
                  style={{ marginTop: 15, color:"red"}}
                >
                  {error ? error: null}
                </Typography>
                {loading ? (
                  <CircularProgress className={classes.progressBar} />
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
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </Paper>
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
