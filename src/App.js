import { Switch, Route, Redirect } from "react-router-dom";

import "./App.css";
import Deductions from "./containers/Deductions";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Positions from "./containers/Positions";
import Schedules from "./containers/Schedules";
import Payroll from "./containers/Payroll";
import Employees from "./containers/Employees";
import Layout from "./hoc/Layout";

function App() {
  return (
    <Switch>
      <Route path="/login/admin" component={Login} />
      <Layout>
        <Route path="/employees" component={Employees} />
        <Route path="/payroll" component={Payroll} />
        <Route path="/schedules" component={Schedules} />
        <Route path="/deductions" component={Deductions} />
        <Route path="/positions" component={Positions} />
        <Route path="/" exact component={Home} />
        <Redirect to="/" />
      </Layout>
    </Switch>
  );
}

export default App;
