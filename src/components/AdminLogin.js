import React from 'react';
import { connect } from "react-redux";

// Form validation imports
import * as Yup from "yup";
import { useFormik } from "formik";
import * as actions from "../store/actions";

// Material import
import { makeStyles } from '@material-ui/core/styles';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import LockIcon from '@material-ui/icons/Lock';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const AdminLogin = ({ 
    login,
}) => {

    const useStyles = makeStyles({
      
        field: {
          minWidth: '80%',
          marginTop: 30,
          fontSize: 18,
          // backgroundColor: '#ffffff',
          borderRadius: 5,
        },
      
        button:{
          // backgroundColor: '#C4C4C4',
          // width: 150,
          marginTop: 30,
          marginBottom: 20,
          alignSelf:'center',
          fontSize: 16
        },

        
      });

    const classes = useStyles();

    const LoginSchema = Yup.object().shape({
        email: Yup
          .string()
          .email("Invalid email")
          .required()
          .label("Email"),
        password: Yup 
          .string()
          .required()
          .label("Password"),
      });

    const formik = useFormik({
        initialValues: {
          email: '',
          password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: (values) => {
          login(values.email, values.password);
          alert(JSON.stringify(values, null, 2));
        },

        
    });

    const [values, setValues] = React.useState({
      password: '',     
      showPassword: false,
    });

    const handleClickShowPassword = () => {
      setValues({ ...values, showPassword: !values.showPassword });
    };
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
    
    return (
        <form onSubmit={formik.handleSubmit}>
        <div>
            <TextField
                variant="outlined"
                name="email"
                label="Email"
                className = {classes.field}
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email) }
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <PersonOutlineIcon fontSize = "medium" />
                        </InputAdornment>
                    ),
                }}
            />     
            <TextField
              variant="outlined"
              name="password"
              label="Password"
              className = {classes.field}
              type={values.showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange('password')}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        >
                          {values.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                        <LockIcon fontSize ="medium" />
                    </InputAdornment>
                ),
             }}
            />

            </div>

            <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disableElevation 
                className={classes.button} 
                size = "small">
                    Sign in
            </Button>
        </form> 
      );
}
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminLogin);