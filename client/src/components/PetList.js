import React, { useEffect, useState } from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import axios from "axios";
import PetCard from "./PetCard";
import Loading from "./Loader";

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const PetList = () => {
  const { drizzle } = useDrizzle();
  console.log(drizzle);
  const drizzleState = useDrizzleState((state) => state);
  console.log(drizzleState);

  // eslint-disable-next-line
  const prePetData = [];
  // eslint-disable-next-line
  const prePetDeletedData = [];
  const [loading, setLoading] = useState(false);
  const [stackId, setStackId] = useState(null);
  const [petData, setPetData] = useState(null);
  const [petDeletedData, setPetDeletedData] = useState(null);

  // get connected account from drizzleState
  const account = drizzleState.accounts[0];
  console.log("account >>> ", account);

  function FromWei(n) {
    return drizzle.web3.utils.fromWei(n, "ether").toString();
  }

  useEffect(() => {
    setLoading(true);

    // Getting contract Obj from drizzle
    const contract = drizzle.contracts.Petshop;

    /* PET CREATED EVENT */
    contract.events
      .PetCreated({ fromBlock: 0 }, async (error, event) => {
        console.log("PetCreated event data fetched!");
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

        prePetData.push({ owner, price, tokenId, tokenURIData });
        // prePetData.sort((a, b) => a - b);
        prePetData.sort(dynamicSort("tokenId", "asc"));
        console.log("prePetData >>> ", prePetData);

        setPetData(prePetData);
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

    function dynamicSort(property, order) {
      var sort_order = 1;
      if (order === "desc") {
        sort_order = -1;
      }
      return function (a, b) {
        // a should come before b in the sorted order
        if (Number(a[property]) < Number(b[property])) {
          return -1 * sort_order;
          // a should come after b in the sorted order
        } else if (Number(a[property]) > Number(b[property])) {
          return 1 * sort_order;
          // a and b are the same
        } else {
          return 0 * sort_order;
        }
      };
    }

    contract.events
      .PetDeleted({ fromBlock: 0 }, async (error, event) => {
        console.log("PetDeleted event data fetched!");
      })
      .on("data", async (event) => {
        if (event !== undefined) await getPetDeletedData(event);
      })
      .on("changed", async (event) => {
        if (event !== undefined) await getPetDeletedData(event);
      })
      .on("error", async (error) => console.log(error));

    const getPetDeletedData = async (data) => {
      try {
        // console.log("data  >>> ", await data);
        const {
          returnValues: { tokenId },
        } = await data;

        console.log("deletedPetObj >>> ", tokenId);

        prePetDeletedData.push(tokenId);
        prePetDeletedData.sort((a, b) => Number(a) - Number(b));
        console.log("prePetDeletedData >>> ", prePetDeletedData);

        setPetDeletedData(prePetDeletedData);
      } catch (error) {
        console.log(error);
      }
    };

    setLoading(false);

    // eslint-disable-next-line
  }, [drizzle]);

  const buyBtnHandler = (petId, petPrice) => (
    <button
      onClick={() => buyBtnClick(petId, petPrice)}
      className="btn btn-primary m-2"
    >
      buy
    </button>
  );

  const buyBtnClick = async (petId, petPrice) => {
    setLoading(true);
    console.log("clicked");
    console.log("petId >>> ", petId);
    console.log("petPrice >>> ", petPrice);

    await buyPet(drizzleState.accounts[0], petPrice, petId);
    setLoading(false);
  };

  // send transaction to blockchain
  const buyPet = async (account, price, tokenId) => {
    // Get contract Obj to send tx
    const contract = drizzle.contracts.Petshop;

    // let drizzle know we want to call the method with 'value'
    const stackId = contract.methods["buyPet"].cacheSend(tokenId, {
      from: account,
      value: price,
    });
    console.log("stackId >>> ", stackId);

    // save the 'stackId' for later reference
    setStackId(stackId);
  };

  const deleteBtnHandler = (petId) => (
    <button
      onClick={() => deleteBtnClick(petId)}
      className="btn btn-danger m-2"
    >
      delete
    </button>
  );

  const deleteBtnClick = async (petId) => {
    setLoading(true);
    console.log("clicked");
    console.log("petId >>> ", petId);

    await deletePet(drizzleState.accounts[0], petId);
    setLoading(false);
  };

  // send transaction to blockchain
  const deletePet = async (account, tokenId) => {
    // Get contract Obj to send tx
    const contract = drizzle.contracts.Petshop;

    // let drizzle know we want to call the method with 'value'
    const stackId = contract.methods["deletePet"].cacheSend(tokenId, {
      from: account,
    });
    console.log("stackId >>> ", stackId);

    // save the 'stackId' for later reference
    setStackId(stackId);
  };

  // get status from blockchain
  const getTxStatus = () => {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = drizzleState;
    // console.log("transactions >>> ", transactions);
    // console.log("transactionStack >>> ", transactionStack);

    // console.log("stackId >>> ", stackId);
    // get the transaction hash using our saved 'stackId'
    const txHash = transactionStack[stackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    // console.log("txHash >>> ", txHash);
    console.log(
      "transactions[txHash] >>> ",
      transactions[txHash] && transactions[txHash]
    );

    // otherwise, return the transaction status
    return `Transaction status: ${
      transactions[txHash] !== undefined
        ? transactions[txHash]?.status
        : "pending..."
    }`;
  };

  console.log("petData >>> ", petData);
  console.log("petDataLength >>> ", petData?.length);

  console.log("petDeletedData >>> ", petDeletedData);

  const isPetAvailable = (petId) => {
    console.log("petId >>> ", petId);
    if (petDeletedData) {
      const index = petDeletedData.lastIndexOf(petId);
      return index === -1 ? true : false;
    }

    return true;
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="container">
        <div className="text-center">{getTxStatus()}</div>
        <div className="row">
          {petData?.map((pet, i) => {
            console.log("isPetAvailable >>> ", isPetAvailable(pet.tokenId));
            if (isPetAvailable(pet.tokenId)) {
              console.log("print ", pet.tokenId);
              return (
                <div key={pet.tokenId} className="col-12 col-md-auto col-lg-3">
                  <PetCard
                    tokenId={pet.tokenId}
                    price={FromWei(pet.price)}
                    name={pet.tokenURIData.name}
                    image={pet.tokenURIData.image}
                    breedObj={pet.tokenURIData.attributes[0]}
                    locationObj={pet.tokenURIData.attributes[1]}
                    ageObj={pet.tokenURIData.attributes[2]}
                    buyBtn={buyBtnHandler(pet.tokenId, pet.price)}
                    deleteBtn={deleteBtnHandler(pet.tokenId)}
                  />
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
    </>
  );
};

export default PetList;
