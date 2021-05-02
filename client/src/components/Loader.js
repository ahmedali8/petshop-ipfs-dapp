import React from "react";
import Loader from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="loader-div">
      <div className="loader">
        <Loader
          type="Grid"
          color="#00BFFF"
          height={100}
          width={100}
          // timeout={3000} //3 secs
        />
      </div>
    </div>
  );
};

export default Loading;
