import React from "react";

const PetCard = ({
  petOwner,
  price,
  name,
  image,
  breedObj,
  locationObj,
  ageObj,
  btn,
}) => {
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  return (
    <>
      <div className="card my-3">
        <img
          src={`https://ipfs.io/ipfs/${image}`}
          className="card-img-top"
          alt="..."
          style={{ width: "250px" }}
        />
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">
            <strong>Price</strong>: <span>{price} Ether</span>
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
                    href={`https://rinkeby.etherscan.io/address/${petOwner}`}
                    className="card-link"
                  >
                    {`${String(petOwner).slice(0, 5)}...${String(
                      petOwner
                    ).slice(37, 42)}`}
                  </a>
                </span>
              </>
            ) : null}
          </p>
          {btn}
        </div>
      </div>
    </>
  );
};

export default PetCard;
