import React, { useEffect, useState } from "react";
import { DrizzleContext, drizzleReactHooks } from "@drizzle/react-plugin";
import axios from "axios";
import PetCard from "./PetCard";
import petListJson from "../pets.json";
import Loading from "./Loader";

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const PetList = () => {
  const { drizzle } = useDrizzle();
  console.log(drizzle);
  const drizzleState = useDrizzleState((state) => state);
  console.log(drizzleState);

  const newArr = [];
  const [loading, setLoading] = useState(false);
  const [dataKey, setDataKey] = useState(null);
  const [petData, setPetData] = useState(null);

  // get connected account from drizzleState
  const account = drizzleState.accounts[0];
  console.log("account >>> ", account);

  // get contract state from drizzleState
  const { Petshop } = drizzleState.contracts;

  function FromWei(n) {
    return drizzle.web3.utils.fromWei(n, "ether").toString();
  }

  useEffect(() => {
    // Getting contract Obj from drizzle
    const contract = drizzle.contracts.Petshop;

    contract.events
      .PetCreated({ fromBlock: 0 }, async (error, event) => {
        console.log("event data fetched!");
      })
      .on("data", async (event) => {
        if (event !== undefined) await getPetCreatedData(event);
      })
      .on("changed", async (event) => {
        if (event !== undefined) await getPetCreatedData(event);
      })
      .on("error", async (error) => console.log(error));

    const getPetCreatedData = async (data) => {
      try {
        setLoading(true);
        // console.log("data  >>> ", await data);
        const {
          returnValues: { owner, price, tokenId, tokenURI },
        } = await data;

        // console.log("petObj >>> ", { owner, price, tokenId, tokenURI });

        const URL = `https://ipfs.io/ipfs/${tokenURI}`;
        // console.log("URL >>>", URL);

        const tokenURIData = await getTokenURIData(URL);
        // console.log("tokenURIData >>>", tokenURIData);

        newArr.push({ owner, price, tokenId, tokenURIData });
        // console.log("newArr >>> ", newArr);

        setPetData(newArr);

        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    const getTokenURIData = async (url) => {
      try {
        const res = await (await axios.get(url)).data;
        return res;
      } catch (error) {
        console.log(error);
      }
    };

    // let drizzle know we want to watch the 'myString' method
    const dataKey = contract.methods["owner"].cacheCall();

    // save the `dataKey` to local component state for later reference
    setDataKey(dataKey);
  }, [drizzle]);

  const btnHandler = (petId) => (
    <button onClick={() => btnClick(petId)} className="btn btn-primary">
      buy
    </button>
  );

  const btnClick = (petId) => {
    console.log("clicked", petId);
  };

  console.log("petData >>> ", petData);
  console.log("petDataLength >>> ", petData?.length);

  /* using the saved 'dataKey', get the variable we're interested in */
  // console.log("dataKey >>> ", dataKey);
  const owner = Petshop.owner[dataKey];
  // console.log("owner >>> ", owner);

  if (loading) return <Loading />;

  return (
    <>
      <div className="container">
        <div className="row">
          {petData ? (
            petData.map((pet) => (
              <div key={pet.tokenId} className="col-12 col-md-4 col-lg-3">
                <PetCard
                  owner={owner}
                  petOwner={pet.owner}
                  price={FromWei(pet.price)}
                  name={pet.tokenURIData.name}
                  image={pet.tokenURIData.image}
                  breedObj={pet.tokenURIData.attributes[0]}
                  locationObj={pet.tokenURIData.attributes[1]}
                  ageObj={pet.tokenURIData.attributes[2]}
                  btn={btnHandler(pet.tokenId)}
                />
              </div>
            ))
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </>
  );
};

export default PetList;
