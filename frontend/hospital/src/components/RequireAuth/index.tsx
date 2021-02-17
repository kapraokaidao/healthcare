import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthStoreContext } from "../../stores";
import { observer } from "mobx-react-lite";

const RequireAuth = observer(({ Component, ...rest }: any) => {
  const authStore = useContext(AuthStoreContext);
  if (!authStore.isSignin) {
    return <Redirect to="/signin" />;
  }
  return <Component {...rest} />;
});

export default RequireAuth;
