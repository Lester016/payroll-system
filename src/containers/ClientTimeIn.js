import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { connect } from "react-redux";

// Material UI
import {
  Button, 
  Paper, 
  InputAdornment,  
  makeStyles, 
  TextField
} from "@material-ui/core/";

import { PersonOutline } from "@material-ui/icons/"


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
      <div className= {classes.container}>
        <Form >
          <h1>Client Time In Screen</h1>
          <Paper className ={classes.paper}>
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
          </Paper>
        </Form>
      </div>
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
