import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { useEffect } from "react";

import "./App.css";
import Deductions from "./containers/Deductions";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Positions from "./containers/Positions";
import Schedules from "./containers/Schedules";
import Payroll from "./containers/Payroll";
import Employees from "./containers/Employees/Employees";
import Layout from "./hoc/Layout";
import PrivateRoute from "./hoc/PrivateRoute";
import * as actions from "./store/actions";
import Logout from "./containers/Logout";

function App({ onAutoSignup }) {
  useEffect(() => {
    onAutoSignup();
  }, [onAutoSignup]);

  return (
    <Switch>
      <Route path="/login" exact component={Login} />

      <Layout>
        <PrivateRoute path="/employees" component={Employees} />
        <PrivateRoute path="/payroll" component={Payroll} />
        <PrivateRoute path="/schedules" component={Schedules} />
        <PrivateRoute path="/deductions" component={Deductions} />
        <PrivateRoute path="/positions" component={Positions} />
        <PrivateRoute path="/logout" component={Logout} />
        <PrivateRoute path="/" exact component={Home} />
        <Redirect to="/" />
      </Layout>
    </Switch>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(null, mapDispatchToProps)(App);
