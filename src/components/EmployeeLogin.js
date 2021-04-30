import React from 'react';
import { connect } from "react-redux";

// Form validation imports
import * as Yup from "yup";
import { useFormik } from "formik";
import * as actions from "../store/actions";

// Material imports
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


const EmmployeeLogin = ({ 
    login,
}) => {

    const useStyles = makeStyles({
        // card:{
        //   height:'200px',
        //   display: 'block',
        // //   textAlign: 'center',
        //   marginTop: 20,
        //   marginBottom: 20,
        //   minWidth: '40%',
        //   backgroundColor: '#E1E1E1',
        //   alignSelf: 'flex-start',
        // },
      
        field: {
          minWidth: '80%',
          marginTop: 50,
          fontSize: 18,
          // backgroundColor: '#ffffff',
          borderRadius: 5,
        },
      
        button:{
          backgroundColor: '#C4C4C4',
          width: 150,
          marginTop: 30,
          alignSelf:'center',
          fontSize: 16,
        },
      });

    const classes = useStyles();

    const LoginSchema = Yup.object().shape({
        id: Yup
            .string()
            .required("ID is required field.")
    });

    const formik = useFormik({
        initialValues: {
          id:''
        },
        validationSchema: LoginSchema,
        onSubmit: (values) => {
          login(values.id);
          alert(JSON.stringify(values, null, 2));
        },
    });

    return(
        <form className={classes.card} onSubmit={formik.handleSubmit}>
            <div>
                <TextField
                variant="outlined"
                name="id"
                label="ID"
                className = {classes.field}
                value={formik.values.id}
                onChange={formik.handleChange}
                error={formik.touched.id && Boolean(formik.errors.id) }
                helperText={formik.touched.id && formik.errors.id}
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
    )
}

const mapStateToProps = (state) => {
    return {
      loading: state.auth.loading,
      error: state.auth.error,
    };
};
  
const mapDispatchToProps = (dispatch) => {
    return {
      login: (userId) => {
        dispatch(actions.login(userId));
      },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmmployeeLogin);