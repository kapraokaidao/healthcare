import React, { createContext, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navigation from "./components/Navigation";
import Spinner from "./components/Spinner";
import Routes from "./routes";
import { authStore, AuthStoreContext } from "./stores";

export const PathContext = createContext({
  path: "/",
  setPath: (path: string) => {},
});

export const TitleContext = createContext({
  title: "Home",
  setTitle: (title: string) => {},
});

function App() {
  const [path, setPath] = useState("/");
  const [title, setTitle] = useState("Home");

  return (
    <AuthStoreContext.Provider value={authStore}>
      <TitleContext.Provider value={{ title, setTitle }}>
        <PathContext.Provider value={{ path, setPath }}>
          <Router>
            <Spinner />
            <Navigation />
            <Routes />
          </Router>
        </PathContext.Provider>
      </TitleContext.Provider>
    </AuthStoreContext.Provider>
  );
}

export default App;
