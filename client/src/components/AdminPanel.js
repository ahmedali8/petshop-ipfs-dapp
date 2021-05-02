import React, { useState, useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

const AdminPanel = () => {
  const [value, setValue] = useState("");
  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (value) => {
    console.log(value); // {value: "PK", label: "Pakistan"}
    setValue(value);
  };
  return (
    <>
      <div className="card border-primary mb-3">
        <div className="card-header text-center">ADMIN PANEL</div>
        <div className="card-body text-primary">
          <form>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="name">Name</label>
                <input type="text" className="form-control" id="name" />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="breed">Breed</label>
                <input type="text" className="form-control" id="breed" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="location">Location</label>
                <Select
                  options={options}
                  value={value}
                  onChange={changeHandler}
                />
                {/* <select id="location" className="form-control">
                  <option defaultValue>Choose...</option>
                  <option>...</option>
                </select> */}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  id="age"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="fileInput">Choose image</label>
                <input
                  type="file"
                  className="form-control-file"
                  id="fileInput"
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
