import { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { connect } from "react-redux";

// Material UI
import {
  Button, 
  Paper, 
  IconButton, 
  InputAdornment,  
  makeStyles, 
  TextField
} from "@material-ui/core/";

import {
   Lock,
   PersonOutline, 
   Visibility, 
   VisibilityOff
} from "@material-ui/icons/"

import * as actions from "../store/actions";

const useStyles = makeStyles({
  container:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign:'center',
    marginTop: 100
  },

  paper:{
    textAlign:'center',
    width: 450,
  },
  field: {
    marginTop: 30,
    width: '80%',
    minWidth: 200
  },
  button: {
    marginTop: 20,
    marginBottom: 30,
    width: '20%',
    minWidth: 100
  },
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
        <div className= {classes.container}>
        <Form>
          <h1>Login Screen</h1>
          <Paper className ={classes.paper} >
          <div>
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
<<<<<<< HEAD
                  <PersonOutline fontSize="medium" />
=======
                  <PersonOutlineIcon />
>>>>>>> 8c78fe7b6437212042a830b256c707c5e89d9fcf
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
<<<<<<< HEAD
                  <Lock fontSize="medium" />
=======
                  <LockIcon />
>>>>>>> 8c78fe7b6437212042a830b256c707c5e89d9fcf
                </InputAdornment>
              ),
            }}
            error={touched.password && errors.password !== undefined}
            helperText={touched.password && errors.password}
          />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disableElevation
            className={classes.button}
          >
            Sign in
          </Button>
          </Paper>
        </Form>
        </div>
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
