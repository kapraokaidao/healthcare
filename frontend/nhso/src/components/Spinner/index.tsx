import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { AuthStoreContext } from "../../stores";
import "./style.scss";

axios.interceptors.request.use(
  (config) => {
    document.getElementById("spinner")?.classList.add("overlay");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    document.getElementById("spinner")?.classList.remove("overlay");
    return response;
  },
  (error) => {
    document.getElementById("spinner")?.classList.remove("overlay");
    return Promise.reject(error);
  }
);

const Spinner = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const authStore = useContext(AuthStoreContext);

  useEffect(() => {
    axios.interceptors.response.use(undefined, (error) => {
      document.getElementById("spinner")?.classList.remove("overlay");
      document.getElementById("dialog")?.classList.add("overlay");
      if (error.response.status === 401 || error.response.status === 403) {
        authStore.signout();
        const error_message = error.response.data?.message;
        setErrors([...errors, error_message]);
      } else {
        const error_message = error.response.data?.message;
        setErrors([...errors, error_message]);
      }
      return Promise.reject(error);
    });
  }, [errors, authStore]);

  const refresh = useCallback(() => {
    window.location.reload(false);
  }, []);

  return (
    <>
      <div id="spinner" className="wrapper-spinner">
        <ClipLoader size={150} color={"#ffffff"} loading={true} />
      </div>
      <div id="dialog" className="wrapper-dialog">
        <div>
          <p>There are errors</p>
          <ul>
            {errors.map((error) => {
              return <li key="error">{error}</li>;
            })}
          </ul>
          <button onClick={refresh} className="reload-btn">
            Reload Page
          </button>
        </div>
      </div>
    </>
  );
};

export default Spinner;
