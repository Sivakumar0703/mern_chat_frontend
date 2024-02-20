import React, { useEffect, useState } from "react";
import logo from "../../images/chat-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
      navigate('/chat')
    }
  },[navigate])

  const handleClick = () => {
    setView((prev) => !prev);
  };

  async function handleSubmit() {
    // e.prevantDefault()
    try {
      const data = {
        email,
        password,
      };
       await axios.post("http://localhost:5000/api/user/login", data)
        .then((res) => {
          toast(res.data.message);
          // setEmail("")
          // setPassword("")
          localStorage.setItem("user",JSON.stringify(res.data.userObj));
          console.log(res.data)
        });
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <div id="login-section">
      <div className="image-container">
        <span className="circle-image">
          <img src={logo} />
        </span>
      </div>
      {/* <form onSubmit={handleSubmit}> */}
      <div className="form-group p-2">
        <label htmlFor="Email">Email</label>
        <input
          type="email"
          className="form-control custom-input"
          placeholder="Enter Your Email"
          id="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="form-group p-2">
        <label htmlFor="Password">Password</label> <br />
        <div className="input-group">
          <input
            type={view ? "text" : "password"}
            className="form-control custom-input"
            placeholder="Enter Password"
            id="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
          />
          <span
            className="input-group-text password-icon"
            id="basic-addon1"
            onClick={handleClick}
          >
            {view ? (
              <FontAwesomeIcon icon={faEye} />
            ) : (
              <FontAwesomeIcon icon={faEyeSlash} />
            )}
          </span>
        </div>
      </div>

      <div className="form-group p-2">
        <a href="#" style={{ textDecoration: "none" }}>
          forgot password ?
        </a>
      </div>

      <div className="form-group pb-2" style={{ textAlign: "center" }}>
        <button className="btn btn-primary login-button" onClick={handleSubmit}>
          Login
        </button>
      </div>

      {/* </form> */}
    </div>
  );
};

export default Login;
