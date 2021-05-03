import React, { useState, useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";
import createMetaData from "../createMetaData";
import ipfs from "../ipfsConfig";

const AdminPanel = () => {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const countryOptions = useMemo(() => countryList().getData(), []);

  let imgBuffer;
  let imgHash;
  let jsonData;
  let jsonHash;

  const handleSubmit = async (e) => {
    e.preventDefault();

    imgHash = await uploadData(imgBuffer);
    console.log("imgHash ", imgHash);

    // const URL = `https://ipfs.infura.io/ipfs/${hash}`;

    jsonData = await createMetaData(name, imgHash, breed, country, age);
    jsonHash = await uploadData(jsonData);
    console.log("jsonHash ", jsonHash);
  };

  async function uploadData(data) {
    console.log(data);
    try {
      const { path } = await ipfs.add(data); // { cid, path, size }
      console.log("path ", path);
      return path;
    } catch (error) {
      console.error(error);
      alert("Please select correct image again!");
      // setLoading(false);
      return;
    }
  }

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      imgBuffer = Buffer(reader.result);
    };
  };

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
                <label htmlFor="fileInput">Choose image</label>
                <input
                  type="file"
                  className="form-control-file"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleFile}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
