import React from 'react';
import { connect } from "react-redux";

// Form validation imports
import * as Yup from "yup";
import { useFormik, Formik, Form, ErrorMessage } from "formik";
import * as actions from "../store/actions";

// Material import
import { makeStyles } from '@material-ui/core/styles';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import LockIcon from '@material-ui/icons/Lock';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const AdminLogin = ({ 
    login,
}) => {

    const useStyles = makeStyles({
        card:{
          display: 'block',
          textAlign: 'center',
          marginTop: 20,
          marginBottom: 20,
          minWidth: '40%',
          backgroundColor: '#E1E1E1',
          alignSelf: 'center',
        },
      
        field: {
          minWidth: '60%',
          marginTop: 20,
          fontSize: 18,
          backgroundColor: '#ffffff',
          borderRadius: 5,
        },
      
        button:{
          backgroundColor: '#C4C4C4',
          width: 150,
          marginTop: 30,
          alignSelf:'center',
          fontSize: 16
        },

        
      });

    const classes = useStyles();
    const LoginSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required().label("Email"),
        password: Yup.string().required().label("Password"),
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
    
    return (
        <form className={classes.card} onSubmit={formik.handleSubmit}>
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
                        <InputAdornment position="start">
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
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                    <InputAdornment position="start">
                        <LockIcon fontSize ="medium"/>
                    </InputAdornment>
                ),
             }}
            />
         
            </div>
            <Button 
                type="submit" 
                variant="contained" 
                color="default" 
                disableElevation 
                className={classes.button} 
                size = "small">
                    SIGN IN
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