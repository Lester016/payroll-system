import { Switch, Route, Redirect } from "react-router-dom";

import "./App.css";

import Deductions from "./containers/Deductions";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Positions from "./containers/Positions";
import Schedules from "./containers/Schedules";
import Attendance from "./containers/Attendance";
import Payroll from "./containers/Payroll";
import Employees from "./containers/Employees";
import Layout from "./hoc/Layout";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/attendance" component={Attendance} />
        <Route path="/employees" component={Employees} />
        <Route path="/payroll" component={Payroll} />
        <Route path="/schedules" component={Schedules} />
        <Route path="/deductions" component={Deductions} />
        <Route path="/positions" component={Positions} />
        <Route path="/login" component={Login} />
        <Route path="/" exact component={Home} />
        <Redirect to="/" />
      </Switch>
    </Layout>
  );
}

export default App;
