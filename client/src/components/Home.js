import React, { useContext, useEffect, useState } from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import AdminPanel from "./AdminPanel";
import PetList from "./PetList";

const Home = () => {
  const [chainId, setChainId] = useState("");
  const [dataKey, setDataKey] = useState(null);

  const useDrizzle = useContext(DrizzleContext.Context);
  const { drizzle, drizzleState, initialized } = useDrizzle;

  console.log("useDrizzle >>> ", useDrizzle);

  useEffect(() => {
    async function getNetworkId() {
      setChainId(initialized && (await drizzle.web3.eth.getChainId()));
    }

    getNetworkId();
  }, [initialized, drizzle]);

  useEffect(() => {
    // Getting contract obj from drizzle
    const contract = drizzle.contracts.Petshop;

    // let drizzle know we want to watch the 'owner' method
    const dataKey = contract.methods["owner"].cacheCall();

    // save the 'dataKey' to local component state for later reference
    setDataKey(dataKey);
  }, []);

  // get connected account from drizzleState
  const account = drizzleState.accounts[0];
  // const account = accounts[0];
  console.log("account >>> ", account);

  // get contract state from drizzleState
  const { Petshop } = drizzleState.contracts;
  console.log("dataKey >>> ", dataKey);

  // using the saved 'dataKey', get the owner object in state
  const owner = Petshop.owner[dataKey];
  console.log("owner >>> ", owner);

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
            {account === owner?.value ? <AdminPanel /> : null}
          </div>
          <div className="col-12">
            <PetList />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
