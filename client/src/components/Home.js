import React, { useEffect, useState } from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import AdminPanel from "./AdminPanel";
import PetList from "./PetList";

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const Home = () => {
  const { drizzle } = useDrizzle();
  // console.log(drizzle);
  const drizzleState = useDrizzleState((state) => state);
  // console.log(drizzleState);

  const [chainId, setChainId] = useState("");
  const [dataKey, setDataKey] = useState(null);

  useEffect(() => {
    async function getNetworkId() {
      setChainId(await drizzle.web3.eth.getChainId());
    }

    getNetworkId();
  }, [drizzle]);

  useEffect(() => {
    // Getting contract obj from drizzle
    const contract = drizzle.contracts.Petshop;

    // let drizzle know we want to watch the 'owner' method
    const dataKey = contract.methods["owner"].cacheCall();

    // save the 'dataKey' to local component state for later reference
    setDataKey(dataKey);
  }, [drizzle]);

  // get connected account from drizzleState
  const account = drizzleState.accounts[0];
  // const account = accounts[0];
  // console.log("account >>> ", account);

  // get contract state from drizzleState
  const { Petshop } = drizzleState.contracts;
  // console.log("dataKey >>> ", dataKey);

  // using the saved 'dataKey', get the owner object in state
  const owner = Petshop.owner[dataKey];
  // console.log("owner >>> ", owner);

  return (
    <>
      <div className="container my-2">
        <div className="text-center">
          <h1>PETSHOP DAPP</h1>
          <div className="alert alert-success" role="alert">
            <span className="m-2">
              Address connected:{" "}
              <a
                href={`https://${
                  chainId === 3 ? "ropsten" : "rinkeby"
                }.etherscan.io/address/${account}`}
                className="card-link"
              >
                {`${String(account).slice(0, 5)}...${String(account).slice(
                  37,
                  42
                )}`}
              </a>
            </span>
            <span className="m-2">Network connected: {chainId}</span>
          </div>
          {chainId && (chainId !== 1337 || chainId !== 3 || chainId !== 4) ? (
            <div className="alert alert-danger" role="alert">
              Please connect to rinkeby or ropsten testnet
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
