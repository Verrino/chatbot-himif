import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const AppRouter = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" />
        </Switch>
      </div>
    </Router>
  );
};

export default AppRouter;
