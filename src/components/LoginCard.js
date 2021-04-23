import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { connect } from "react-redux";

import * as actions from "../store/actions";

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import InputAdornment from '@material-ui/core/InputAdornment';
import AccountBoxIcon from '@material-ui/icons/AccountBox';




const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems:'center',
  },

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
    height: 40,
    minWidth: '60%',
    paddingLeft: 30,
    marginTop: 20,
    fontSize: 18,
    border: '1px solid black',
    boxShadow: "1px 3px 1px #9E9E9E"
  },

  button:{
    backgroundColor: '#C4C4C4',
    width: 150,
    height: 39,
    marginTop: 30,
    alignSelf:'center',
    fontSize: 18
  },
});

const LoginCard = ({ login, isAdmin, }) => {
  const classes = useStyles();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required().label("Email"),
    password: Yup.string().required().label("Password"),
  });

  if(isAdmin){
    return (
      <div className = {classes.root}>
      <h1 className = 'primary'>ADMIN Login</h1>       
      <Card className={classes.card}>
        <CardContent>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={(values) => {
              login(values.email, values.password);
            }}
          >
            {() => (
              <Form className={classes.card}>
                <div>
                  <Field type="email" name="email" placeholder="Username" className = {classes.field} /> 
                  <ErrorMessage 
                      name="email"
                      component="div"
                      className="error-message"
                  />
                        
                  <Field type="password" name="password" placeholder="Password" className = {classes.field}/>
                  <ErrorMessage
                      name="password"
                      component="div"
                      className="error-message"
                  />
                </div> 
                <button type="submit" className = {classes.button}>Sign-in</button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
      </div>
    )}
    
    return (
      <div className = {classes.root}>
      <h1 className = 'primary'>Employee ID</h1>       
      <Card className={classes.card}>
        <CardContent>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={(values) => {
              login(values.email, values.password);
            }}
          >
            {() => (
              <Form>
                <div>
                  <Field name="ID" placeholder="ID" className = {classes.field} /> 
                </div>
                    
                <button type="submit" className = {classes.button}>Sign-in</button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
      </div>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginCard);