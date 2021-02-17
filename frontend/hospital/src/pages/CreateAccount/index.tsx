import React, { useCallback, useContext, useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import { Hospital, Role, UserCreate } from "../../types";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TitleContext } from "../../App";
import { debounce } from "lodash";

const CreateAccount = () => {
  const { setTitle } = useContext(TitleContext);
  useEffect(() => {
    setTitle("Create Account");
  }, [setTitle]);
  const history = useHistory();
  const [account, setAccount] = useState<UserCreate>({
    firstname: "",
    lastname: "",
    address: "",
    phone: "",
    username: "",
    password: "",
  });

  const createAccount = async () => {
    await axios.post("/hospital", account);
    history.push("/account");
  };

  const handleInputChange = (props: any) => (event: { target: { value: any } }) => {
    setAccount({ ...account, [props]: event.target.value });
  };

  return (
    <>
      <div className="sitehome">
        <div className="mt-15">
          <h1>Create Account</h1>
        </div>
        <div className="mt-15">
          <Grid container spacing={2}>
            <Grid item xs={4} container alignItems="flex-end">
              Firstname
            </Grid>
            <Grid item xs={8}>
              <TextField
                id="outlined-firstname-input"
                label="Firstname"
                variant="outlined"
                value={account.firstname}
                onChange={handleInputChange("firstname")}
                fullWidth
              />
            </Grid>
            <Grid item xs={4} container alignItems="flex-end">
              Lastname
            </Grid>
            <Grid item xs={8}>
              <TextField
                id="outlined-lastname-input"
                label="Last Name"
                variant="outlined"
                value={account.lastname}
                onChange={handleInputChange("lastname")}
                fullWidth
              />
            </Grid>
            <Grid item xs={4} container alignItems="flex-end">
              Address
            </Grid>
            <Grid item xs={8}>
              <TextField
                id="outlined-address-input"
                label="Address"
                variant="outlined"
                value={account.address}
                onChange={handleInputChange("address")}
                fullWidth
              />
            </Grid>
            <Grid item xs={4} container alignItems="flex-end">
              Phone
            </Grid>
            <Grid item xs={8}>
              <TextField
                id="outlined-phone-input"
                label="Phone"
                variant="outlined"
                value={account.phone}
                onChange={handleInputChange("phone")}
                fullWidth
              />
            </Grid>
            <Grid item xs={4} container alignItems="flex-end">
              Username
            </Grid>
            <Grid item xs={8}>
              <TextField
                id="outlined-username-input"
                label="Username"
                variant="outlined"
                value={account.username}
                onChange={handleInputChange("username")}
                fullWidth
              />
            </Grid>
            <Grid item xs={4} container alignItems="flex-end">
              Password
            </Grid>
            <Grid item xs={8}>
              <TextField
                id="outlined-password-input"
                label="Password"
                type="password"
                variant="outlined"
                value={account.password}
                onChange={handleInputChange("password")}
                fullWidth
              />
            </Grid>
          </Grid>
        </div>
        <div className="mt-15 align-right">
          <Button
            color="primary"
            size="large"
            onClick={() => {
              history.push("/account");
            }}
          >
            Cancel
          </Button>
          <Button onClick={createAccount} variant="contained" color="primary" size="large">
            Create
          </Button>
        </div>
      </div>
    </>
  );
};
export default CreateAccount;
