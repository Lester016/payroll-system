import { Switch, Route, Redirect } from "react-router-dom";

import "./App.css";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Register from "./containers/Register";
import Layout from "./hoc/Layout";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/" exact component={Home} />
        <Redirect to="/" />
      </Switch>
    </Layout>
  );
}

export default App;
