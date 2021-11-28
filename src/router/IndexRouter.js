import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "../views/login/Login";
import NewsSandBox from "../views/sandbox/NewsSandBox";
export default function IndexRouter() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login} />
        {/* 每次匹配到路径/，都会执行下面的这个路由 */}
        <Route
          path="/"
          render={() =>
            localStorage.getItem("token") ? (
              <NewsSandBox></NewsSandBox>
            ) : (
              <Redirect to="/login" />
            )
          }
        />
      </Switch>
    </HashRouter>
  );
}
