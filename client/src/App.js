import React, { useContext } from "react";
import { DrizzleContext } from "@drizzle/react-plugin";

const App = () => {
  console.log("DrizzleContext >>> ", DrizzleContext);
  console.log("DrizzleContext.Context >>> ", DrizzleContext.Context);
  const useDrizzle = useContext(DrizzleContext.Context);
  console.log("useDrizzle >>> ", useDrizzle);

  // const {drizzle, drizzleState, initialized} = useDrizzle;

  if (!useDrizzle.initialized) return "Drizzle Loading...";

  return (
    <>
      <div className="container text-center my-2">
        <h1>PETSHOP DAPP</h1>
        <div className="alert alert-success" role="alert">
          Network connected: Local 5777
        </div>
      </div>
    </>
  );
};

export default App;
