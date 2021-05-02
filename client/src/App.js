import React, { useContext } from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import AdminPanel from "./components/AdminPanel";
import PetList from "./components/PetList";
import Loading from "./components/Loader";

import "./App.css";

const App = () => {
  console.log("DrizzleContext >>> ", DrizzleContext);
  console.log("DrizzleContext.Context >>> ", DrizzleContext.Context);
  const useDrizzle = useContext(DrizzleContext.Context);
  console.log("useDrizzle >>> ", useDrizzle);

  // const {drizzle, drizzleState, initialized} = useDrizzle;

  if (!useDrizzle.initialized) return <Loading />;

  return (
    <>
      <div className="container my-2">
        <div className="text-center">
          <h1>PETSHOP DAPP</h1>
          <div className="alert alert-success" role="alert">
            Network connected: Local 5777
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-10 mx-auto">
            <AdminPanel />
          </div>
          <div className="col-12">
            <PetList />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
