import React, { useContext, useEffect, useState } from "react";
import nhso from "../../images/nhso.png";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import { User } from "../../types";
import { TitleContext } from "../../App";
import { AuthStoreContext } from "../../stores";
import { observer } from "mobx-react-lite";

const SiteHome = observer(() => {
  const { setTitle } = useContext(TitleContext);
  const authStore = useContext(AuthStoreContext);
  useEffect(() => {
    setTitle("Home");
  }, [setTitle]);
  const [user, setUser] = useState<User>();

  return (
    <>
      <div className="sitehome">
        <div>
          <div className="center">
            <img src={nhso} />
          </div>
          <div className="mt-15">
            <Typography variant="h2" gutterBottom align="center">
              {authStore.user?.username}
            </Typography>
          </div>
          <div className="mt-15">
            <Box border={1} padding={2}>
              <Grid container spacing={2}>
                <Grid item xs={3} container alignItems="flex-end">
                  <Typography variant="h5" gutterBottom align="left">
                    First name
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h6" gutterBottom align="left">
                    {authStore.user?.firstname}
                  </Typography>
                </Grid>
                <Grid item xs={3} container alignItems="flex-end">
                  <Typography variant="h5" gutterBottom align="left">
                    Last Name
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h6" gutterBottom align="left">
                    {authStore.user?.lastname}
                  </Typography>
                </Grid>
                <Grid item xs={3} container alignItems="flex-end">
                  <Typography variant="h5" gutterBottom align="left">
                    Phone
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h6" gutterBottom align="left">
                    {authStore.user?.phone}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
});

export default SiteHome;
