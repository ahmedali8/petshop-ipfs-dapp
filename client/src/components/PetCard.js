import React from "react";

const PetCard = ({ image, title, breed, age, location, petOwner, btn }) => {
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  return (
    <>
      <div className="card my-3">
        <img src={image} className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">
            <strong>Breed</strong>: <span>{breed}</span>
            <br />
            <strong>Age</strong>: <span>{age}</span>
            <br />
            <strong>Location</strong>:{" "}
            <span>
              {location.label}, {location.value}
            </span>
            <br />
            {petOwner !== zeroAddress ? (
              <>
                <strong>Owner</strong>:{" "}
                <span>
                  <a
                    href={`https://rinkeby.etherscan.io/address/${petOwner}`}
                    class="card-link"
                  >
                    {`${String(petOwner).slice(0, 5)}...${String(
                      petOwner
                    ).slice(37, 42)}`}
                  </a>
                </span>
              </>
            ) : null}
          </p>
          <a href="#" className="btn btn-primary">
            buy
          </a>
        </div>
      </div>
    </>
  );
};

export default PetCard;
