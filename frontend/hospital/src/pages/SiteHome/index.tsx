import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { TitleContext } from "../../App";
import hospital from "../../images/hospital.png";
import { AuthStoreContext } from "../../stores";
import "./style.scss";

const SiteHome = observer(() => {
  const { setTitle } = useContext(TitleContext);
  const authStore = useContext(AuthStoreContext);
  useEffect(() => {
    setTitle("Home");
  }, [setTitle]);

  return (
    <>
      <div>
        <div className="center">
          <img src={hospital} />
        </div>
        <div className="center">
          <table className="table-info mt-15">
            <tr>
              <td>Hospital Name</td>
              <td>{authStore.user?.hospital?.fullname}</td>
            </tr>
            <tr>
              <td>Unit</td>
              <td>{authStore.user?.hospital?.unit}</td>
            </tr>
            <tr>
              <td>Type</td>
              <td>{authStore.user?.hospital?.type}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>
                {authStore.user?.hospital?.address}{" "}
                {authStore.user?.hospital?.moo}{" "}
                {authStore.user?.hospital?.tambon}{" "}
                {authStore.user?.hospital?.amphur}{" "}
                {authStore.user?.hospital?.province}{" "}
                {authStore.user?.hospital?.zipcode}
              </td>
            </tr>
            <tr>
              <td>Telephone</td>
              <td>{authStore.user?.hospital?.telephone}</td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
});

export default SiteHome;
