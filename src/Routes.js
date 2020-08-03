import React from "react";
import { Route, Switch } from "react-router-dom";

import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

import Home from "./containers/Home";
import Login from "./containers/Login";
import Questions from "./containers/Questions";
import Signup from "./containers/Signup";
import NewQuestion from "./containers/NewQuestion";
import NotFound from "./containers/NotFound";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/index.html">
        <Home />
      </Route>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup">
        <Signup />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/questions/new">
        <NewQuestion />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/questions/:id">
        <Questions />
      </AuthenticatedRoute>
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}