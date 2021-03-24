import React, { useContext, useEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { PathContext } from "../App";
import RequireAuth from "../components/RequireAuth";
import Bill from "../pages/Bill";
import BillTable from "../pages/BillTable";
import ChangePassword from "../pages/ChangePassword";
import CreateAccount from "../pages/CreateAccount";
import KYC from "../pages/KYC";
import ManageAccount from "../pages/ManageAccount";
import Signin from "../pages/Signin";
import Transaction from "../pages/Transaction";
import CreateToken from "./../pages/CreateToken";
import ManageToken from "./../pages/ManageToken";
import SiteHome from "./../pages/SiteHome";

const Routes = () => {
  const location = useLocation();
  const { setPath } = useContext(PathContext);
  useEffect(() => {
    setPath(location.pathname);
  }, [setPath, location.pathname]);

  return (
    <div className="container">
      <Switch>
        <Route exact path="/" component={(props: any) => <RequireAuth {...props} Component={SiteHome} />} />
        <Route exact path="/signin" component={Signin} />
        <Route
          exact
          path="/account/create"
          component={(props: any) => <RequireAuth {...props} Component={CreateAccount} />}
        />
        <Route exact path="/account" component={(props: any) => <RequireAuth {...props} Component={ManageAccount} />} />
        <Route
          exact
          path="/token/create"
          component={(props: any) => <RequireAuth {...props} Component={CreateToken} />}
        />
        <Route exact path="/token" component={(props: any) => <RequireAuth {...props} Component={ManageToken} />} />
        <Route exact path="/kyc" component={(props: any) => <RequireAuth {...props} Component={KYC} />} />
        <Route
          exact
          path="/password/change"
          component={(props: any) => <RequireAuth {...props} Component={ChangePassword} />}
        />
        <Route exact path="/bill/:id" component={(props: any) => <RequireAuth {...props} Component={Bill} />} />
        <Route exact path="/bill" component={(props: any) => <RequireAuth {...props} Component={BillTable} />} />
        <Route
          exact
          path="/transaction"
          component={(props: any) => <RequireAuth {...props} Component={Transaction} />}
        />
      </Switch>
    </div>
  );
};

export default Routes;
