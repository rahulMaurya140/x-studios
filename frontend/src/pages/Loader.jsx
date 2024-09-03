import React from "react";
import { Dna } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="loading-circle" style = {{marginTop: "40px"}}>
      <Dna
        visible={true}
        height="500"
        width="800"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      />

      <h1 style = {{color: 'white', marginTop: '-70px'}}>Fetching Data From X, and making Dashboard......</h1>
    </div>
  );
};

export default Loader;
