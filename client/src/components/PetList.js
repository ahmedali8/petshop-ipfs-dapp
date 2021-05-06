import React, { useEffect, useState } from "react";
import { DrizzleContext, drizzleReactHooks } from "@drizzle/react-plugin";
import PetCard from "./PetCard";
import petListJson from "../pets.json";

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const PetList = () => {
  const { drizzle } = useDrizzle();
  console.log(drizzle);
  const drizzleState = useDrizzleState((state) => state);
  console.log(drizzleState);

  const [dataKey, setDataKey] = useState(null);
  const [petData, setPetData] = useState([]);

  // get connected account from drizzleState
  const account = drizzleState.accounts[0];
  console.log("account >>> ", account);

  // get contract state from drizzleState
  const { Petshop } = drizzleState.contracts;

  useEffect(() => {
    // Getting contract Obj from drizzle
    const contract = drizzle.contracts.Petshop;

    // contract.events
    //   .PetCreated({ fromBlock: 0, toBlock: "latest" }, (error, event) => {
    //     console.log(error, event);
    //   })
    //   .on("data", (event) => console.log(event))
    //   .on("changed", (event) => console.log(event))
    //   .on("error", (error) => console.log(error));

    // console.log("res >>> ", res);

    contract.events.PetCreated(
      {
        fromBlock: 0,
        toBlock: "latest",
      },
      async (error, event) => {
        try {
          const {
            returnValues: { owner, price, tokenId, tokenURI },
          } = event;
          console.log("owner >>> ", owner);
          console.log("price >>> ", price);
          console.log("tokenId >>> ", tokenId);
          console.log("tokenURI >>> ", tokenURI);

          setPetData([...petData, { owner, price, tokenId, tokenURI }]);
        } catch (error) {
          console.log(error);
        }
      }
    );

    // let drizzle know we want to watch the 'myString' method
    const dataKey = contract.methods["owner"].cacheCall();

    // save the `dataKey` to local component state for later reference
    setDataKey(dataKey);
  }, []);

  console.log("petData >>> ", petData);

  console.log("dataKey >>> ", dataKey);

  // using the saved 'dataKey', get the variable we're interested in
  const owner = Petshop.owner[dataKey];
  console.log("owner >>> ", owner);

  return (
    <>
      <div className="container">
        <div className="row">
          Hello
          {/* {petListJson.map((pet, i) => (
            <div key={i} className="col-12 col-md-4 col-lg-3">
              <PetCard
                imgSrc={pet.picture}
                title={pet.name}
                breed={pet.breed}
                age={pet.age}
                location={pet.location}
                petOwner={petOwner}
                // btn={btnHandler(pet.id)}
              />
              <PetCard image={pet.picture} />
            </div>
          ))} */}
        </div>
      </div>
    </>
  );
};

export default PetList;
