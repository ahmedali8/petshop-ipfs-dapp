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
  const prePetPurchaseData = [];
  const [loading, setLoading] = useState(false);

  const [stackId, setStackId] = useState(null);

  const [petData, setPetData] = useState(null);
  const [petPurchaseData, setPetPurchaseData] = useState(null);

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
        prePetData.sort((a, b) => a - b);
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

    /* PET PURCHASE EVENT */
    contract.events
      .PetPurchase({ fromBlock: 0 }, async (error, event) => {
        console.log("PetPurchase event data fetched!");
      })
      .on("data", async (event) => {
        if (event !== undefined) await getPetPurchaseData(event);
      })
      .on("changed", async (event) => {
        if (event !== undefined) await getPetPurchaseData(event);
      })
      .on("error", async (error) => {
        console.log(error);
      });

    const getPetPurchaseData = async (data) => {
      try {
        // console.log("data  >>> ", await data);
        const {
          returnValues: { newOwner, prevOwner, tokenId },
        } = await data;

        console.log("petPurchaseObj >>> ", { newOwner, prevOwner, tokenId });

        prePetPurchaseData.push({ newOwner, prevOwner, tokenId });
        prePetPurchaseData.sort(
          (a, b) => Number(a.tokenId) - Number(b.tokenId)
        );
        console.log("prePetPurchaseData >>> ", prePetPurchaseData);

        setPetPurchaseData(prePetPurchaseData);
      } catch (error) {
        console.log(error);
      }
    };

    setLoading(false);

    // eslint-disable-next-line
  }, [drizzle]);

  const handleOwner = (owner, id) => {
    console.log(owner, id);
    let newOwner = owner;

    // eslint-disable-next-line
    petPurchaseData?.map((purchasedPet) => {
      if (owner === purchasedPet.prevOwner && id === purchasedPet.tokenId) {
        console.log("owner >>> ", owner);
        console.log("id >>> ", id);
        console.log("purchasedPet.newOwner >>> ", purchasedPet.newOwner);

        newOwner = purchasedPet.newOwner;
      } else {
        newOwner = owner;
      }
    });

    return newOwner;
  };

  const btnHandler = (petId, petPrice) => (
    <button
      onClick={() => btnClick(petId, petPrice)}
      className="btn btn-primary"
    >
      buy
    </button>
  );

  const btnClick = async (petId, petPrice) => {
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

  console.log("petPurchaseData >>> ", petPurchaseData);

  if (loading) return <Loading />;

  return (
    <>
      <div className="container">
        <div className="text-center">{getTxStatus()}</div>
        <div className="row">
          {petData?.map((pet) => (
            <div key={pet.tokenId} className="col-12 col-md-auto col-lg-3">
              <PetCard
                tokenId={pet.tokenId}
                petOwner={handleOwner(pet.owner, pet.tokenId)}
                price={FromWei(pet.price)}
                name={pet.tokenURIData.name}
                image={pet.tokenURIData.image}
                breedObj={pet.tokenURIData.attributes[0]}
                locationObj={pet.tokenURIData.attributes[1]}
                ageObj={pet.tokenURIData.attributes[2]}
                btn={btnHandler(pet.tokenId, pet.price)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PetList;
