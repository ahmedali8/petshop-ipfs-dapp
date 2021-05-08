import React, { useState, useMemo } from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import Select from "react-select";
import countryList from "react-select-country-list";
import createMetaData from "../createMetaData";
import ipfs from "../ipfsConfig";
import Loader from "./Loader";

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const AdminPanel = () => {
  const { drizzle } = useDrizzle();
  // console.log(drizzle);
  const drizzleState = useDrizzleState((state) => state);
  // console.log(drizzleState);

  // function FromWei(n) {
  //   return drizzle.web3.utils.fromWei(n, "ether").toString();
  // }
  const [loading, setLoading] = useState(false);

  const [stackId, setStackId] = useState(null);

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [price, setPrice] = useState(0);
  const countryOptions = useMemo(() => countryList().getData(), []);

  let imgBuffer;
  let imgHash;
  let jsonData;
  let jsonHash;

  function toWei(n) {
    return drizzle.web3.utils.toWei(n, "ether");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    imgHash = await uploadData(imgBuffer);
    // console.log("imgHash ", imgHash);

    // const URL = `https://ipfs.infura.io/ipfs/${hash}`;

    jsonData = await createMetaData(name, imgHash, breed, country, age);
    jsonHash = await uploadData(jsonData);
    // console.log("jsonHash ", jsonHash);

    await createPet(
      drizzleState.accounts[0],
      toWei(price.toString()),
      jsonHash
    );

    setName("");
    setBreed("");
    setCountry("");
    setAge("");
    setPrice(0);

    setLoading(false);
  };

  // Upload data to ipfs
  async function uploadData(data) {
    // console.log(data);
    try {
      const { path } = await ipfs.add(data); // { cid, path, size }
      // console.log("path ", path);
      return path;
    } catch (error) {
      console.error(error);
      alert("Please select correct image again!");
      // setLoading(false);
      return;
    }
  }

  // send transaction to blockchain
  const createPet = async (account, price, hash) => {
    // Get contract Obj to send tx
    const contract = drizzle.contracts.Petshop;

    // let drizzle know we want to call the method with 'value'
    const stackId = contract.methods["createPet"].cacheSend(
      account,
      price,
      hash,
      {
        from: account,
      }
    );
    // console.log("stackId >>> ", stackId);

    // save the 'stackId' for later reference
    setStackId(stackId);
  };

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

    // otherwise, return the transaction status
    return `Transaction status: ${
      transactions[txHash] !== undefined
        ? transactions[txHash]?.status
        : "pending..."
    }`;
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new window.FileReader();
    if (file) {
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        imgBuffer = Buffer(reader.result);
      };
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="card border-primary mb-3">
        <div className="card-header text-center">ADMIN PANEL</div>
        <div className="card-body text-primary">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="breed">Breed</label>
                <input
                  type="text"
                  className="form-control"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="location">Location</label>
                <Select
                  options={countryOptions}
                  value={country}
                  onChange={(e) => setCountry(e)} // {value: "PK", label: "Pakistan"}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="age">Age</label>
                <input
                  type="text"
                  className="form-control"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="age">Price (ether)</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="fileInput">Choose image</label>
                <input
                  type="file"
                  className="form-control-file"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleFile}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6 mx-auto">
                <button type="submit" className="btn btn-primary w-100">
                  Submit
                </button>
                <div className="text-center">{getTxStatus()}</div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
