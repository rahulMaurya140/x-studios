import React, { useState } from "react";
import "./Login.css";
import Loader from "./Loader.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [searchedname, setSearchedName] = useState("");
  // const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    console.log(searchedname);
    axios
      .get(`http://localhost:5000/api/scrap`, {
        params: {
          searchedname: searchedname
        },
      })
      .then(() => {
        setLoading(false);
        // sending the searched name to home.jsx
        navigate('/dashboard', { state: { searchedname: searchedname } });
        // navigate("/dashboard");
      })
      .catch((err) =>{
        navigate("/");
      });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        
        <div style={{ marginTop: "150px" }} className="login-container">
          <h2 className="heading">X Login </h2>
          <div className="input-container">
            <label className="labelDesign" htmlFor="username">
              Search Name
            </label>
            <input className="inputTag"
              placeholder="Enter username here"
              type="text"
              id="username"
              value={searchedname}
              onChange={(e) => setSearchedName(e.target.value)}
            />
          </div>
          <button onClick={handleLogin}>Submit</button>
        </div>
      )}

      {/* <Loader/> */}
    </>
  );
};

export default Login;
