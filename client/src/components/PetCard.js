import React from "react";

const PetCard = ({ image }) => {
  console.log(image);
  return (
    <>
      <div className="card my-3">
        <img src={image} className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title">Card title</h5>
          <p className="card-text">
            <strong>Breed</strong>: <span>0</span>
            <br />
            <strong>Age</strong>: <span>0</span>
            <br />
            <strong>Location</strong>: <span>0</span>
            <br />
            <strong>Owner</strong>: <span>0</span>
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
