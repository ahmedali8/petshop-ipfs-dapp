import React from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import Loading from "./components/Loader";
import Home from "./components/Home";

import "./App.css";

const { useDrizzleState } = drizzleReactHooks;

const App = () => {
  // console.log(drizzleReactHooks); // DrizzleProvider, Initializer, useDrizzle, useDrizzleState
  const drizzleStatus = useDrizzleState((state) => state.drizzleStatus);

  window.ethereum.on("accountsChanged", (accounts) => {
    window.location.reload();
  });

  window.ethereum.on("chainChanged", (chainId) => {
    window.location.reload();
  });

  // Display loading component if drizzle is not initialized
  if (!drizzleStatus.initialized) return <Loading />;

  return (
    <>
      <Home />
    </>
  );
};

export default App;
