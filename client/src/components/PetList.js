import React, { useEffect, useState } from "react";
import { DrizzleContext, drizzleReactHooks } from "@drizzle/react-plugin";
import axios from "axios";
import PetCard from "./PetCard";
import petListJson from "../pets.json";

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const PetList = () => {
  const { drizzle } = useDrizzle();
  console.log(drizzle);
  const drizzleState = useDrizzleState((state) => state);
  console.log(drizzleState);

  const [dataKey, setDataKey] = useState(null);
  const [petData, setPetData] = useState(null);

  const newArr = [];

  // get connected account from drizzleState
  const account = drizzleState.accounts[0];
  console.log("account >>> ", account);

  // get contract state from drizzleState
  const { Petshop } = drizzleState.contracts;

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
      } catch (error) {
        console.log(error);
      }
    };

    // getPastEvents
    /*
    const getEventsData = async () => {
      const eventOptions = {
        fromBlock: 0,
        toBlock: "latest",
      };
      const petCreatedArr = await getPastEvents("PetCreated", eventOptions);

      console.log("petCreatedArr >>> ", petCreatedArr);

      const newArr = [];

      petCreatedArr?.map((item) => {
        console.log("item >>> ", item);
        const {
          returnValues: { owner, price, tokenId, tokenURI },
        } = item;
        console.log({ owner, price, tokenId, tokenURI });

        newArr.push({ owner, price, tokenId, tokenURI });
        // setPetData(...petData, { owner, price, tokenId, tokenURI });
      });

      console.log("newArr >>> ", newArr);
      setPetData(...petData, newArr);

      // console.log("petCreatedArr >>> ", { owner, price, tokenId, tokenURI });

      // setPetData(...petData, { owner, price, tokenId, tokenURI });
    })
    */

    /*
    contract.events.PetCreated(
      {
        fromBlock: 0,
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

          const URL = `https://ipfs.io/ipfs/${tokenURI}`;
          console.log("URL >>>", URL);

          const tokenURIData = await getTokenURIData(URL);
          console.log("tokenURIData >>>", tokenURIData);

          setPetData([...petData, { owner, price, tokenId, tokenURI }]);
        } catch (error) {
          console.log(error);
        }
      }
    );
    */

    const getTokenURIData = async (url) => {
      try {
        const res = await (await axios.get(url)).data;
        return res;
      } catch (error) {
        console.log(error);
      }
    };

    /*
    async function getPastEvents(eventName, options) {
      const web3 = drizzle.web3;
      const contract = drizzle.contracts.Petshop;
      const yourContractWeb3 = new web3.eth.Contract(
        contract.abi,
        contract.address
      );

      return await yourContractWeb3.getPastEvents(eventName, options);
    }
    */

    // let drizzle know we want to watch the 'myString' method
    const dataKey = contract.methods["owner"].cacheCall();

    // save the `dataKey` to local component state for later reference
    setDataKey(dataKey);
  }, [drizzle]);

  console.log("petData >>> ", petData);
  console.log("petDataLength >>> ", petData?.length);

  // console.log("dataKey >>> ", dataKey);

  // using the saved 'dataKey', get the variable we're interested in
  const owner = Petshop.owner[dataKey];
  // console.log("owner >>> ", owner);

  return (
    <>
      <div className="container">
        <div className="row">
          Hello
          {/* {petData?.map((pet, i) => {
            console.log(pet.owner);
            return <p>{pet.owner}</p>;
          })} */}
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
