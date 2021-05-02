import React from "react";
import PetCard from "./PetCard";
import petListJson from "../pets.json";

const PetList = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          {petListJson.map((_, i) => (
            <div key={i} className="col-12 col-md-4 col-lg-3">
              <PetCard />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PetList;
