import React, { useEffect, useState } from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const PetCard = ({
  tokenId,
  price,
  name,
  image,
  breedObj,
  locationObj,
  ageObj,
  buyBtn,
  deleteBtn,
}) => {
  const zeroAddress = "0x0000000000000000000000000000000000000000";

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

    // Getting contract obj from drizzle
    const contract = drizzle.contracts.Petshop;

    // let drizzle know we want to watch the 'owner' method
    const dataKey = contract.methods["ownerOf"].cacheCall(tokenId);

    // save the 'dataKey' to local component state for later reference
    setDataKey(dataKey);
  }, [drizzle, tokenId]);

  // get contract state from drizzleState
  const { Petshop } = drizzleState.contracts;
  // console.log("dataKey >>> ", dataKey);

  // using the saved 'dataKey', get the petOwner object in state
  let petOwner = Petshop.ownerOf[dataKey];
  petOwner = petOwner?.value;
  console.log("petOwner >>> ", petOwner);

  return (
    <>
      <div className="card border-primary my-3">
        <img
          src={`https://ipfs.io/ipfs/${image}`}
          className="card-img-top"
          alt="..."
          style={{ width: "100%", height: "auto" }}
        />
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">
            <strong>Price</strong>:{" "}
            <span>{price !== 0 ? `${price} Ether` : "Free"}</span>
            <br />
            <strong>{breedObj.trait_type}</strong>:{" "}
            <span>{breedObj.value}</span>
            <br />
            <strong>{ageObj.trait_type}</strong>: <span>{ageObj.value}</span>
            <br />
            <strong>{locationObj.trait_type}</strong>:{" "}
            <span>
              {locationObj.label}, {locationObj.value}
            </span>
            <br />
            {petOwner !== zeroAddress ? (
              <>
                <strong>PetOwner</strong>:{" "}
                <span>
                  <a
                    href={`https://${
                      chainId === 3 ? "ropsten" : "rinkeby"
                    }.etherscan.io/address/${petOwner}`}
                    className="card-link"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {`${String(petOwner).slice(0, 5)}...${String(
                      petOwner
                    ).slice(37, 42)}`}
                  </a>
                </span>
              </>
            ) : null}
          </p>
          {buyBtn}
          {deleteBtn}
        </div>
      </div>
    </>
  );
};

export default PetCard;
