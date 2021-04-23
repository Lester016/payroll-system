import { Switch, Route, Redirect } from "react-router-dom";

import "./App.css";

import Deductions from "./containers/Deductions";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Positions from "./containers/Positions";
import { Schedules } from "./containers/Schedules";
import Layout from "./hoc/Layout";

function App() {
  return (
    <Layout>
      <Switch>
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
