import React, { useContext, useEffect, useState } from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import AdminPanel from "./components/AdminPanel";
import PetList from "./components/PetList";
import Loading from "./components/Loader";

import "./App.css";

const App = () => {
  const [chainId, setChainId] = useState("");

  const useDrizzle = useContext(DrizzleContext.Context);
  const { drizzle, drizzleState, initialized } = useDrizzle;

  console.log("useDrizzle >>> ", useDrizzle);

  window.ethereum.on("accountsChanged", (accounts) => {
    window.location.reload();
  });

  window.ethereum.on("chainChanged", (chainId) => {
    window.location.reload();
  });

  useEffect(() => {
    async function getNetworkId() {
      setChainId(initialized && (await drizzle.web3.eth.getChainId()));
    }

    getNetworkId();
  }, [initialized, drizzle]);

  if (!initialized) return <Loading />;

  return (
    <>
      <div className="container my-2">
        <div className="text-center">
          <h1>PETSHOP DAPP</h1>
          <div className="alert alert-success" role="alert">
            Network connected: {chainId}
          </div>
          {chainId && chainId != "1337" ? (
            <div className="alert alert-danger" role="alert">
              Please connect to local testnet
            </div>
          ) : null}
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
