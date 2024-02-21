import React, { useContext, useState } from "react";
import logo from "../../images/chat-logo.png";
import "./header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import ProfileModal from "../profile modal/ProfileModal";
import { chatContext } from "../context/ChatContext";
import axios from "axios";
import Offcanvas from "./Offcanvas";

const Header = () => {
  const [search, setSearch] = useState("");
  const { user } = useContext(chatContext);
  const [nameList, setNameList] = useState([]);
  // search for friends
  const handleSearch = async () => {
    if (!search) {
      return alert("Please type something to search");
    }

    try {
      const result = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      // console.log(result.data.users);
      setNameList(result.data.users);
    } catch (error) {
      console.log("error in searching friends", error);
    }
  };
  return (
    <div className="container-fluid header">
      <nav className="navbar navbar-expand-lg navbar-light navigation">
        {/* logo */}
        <div>
          <a href="#" className="navbar-brand">
            <img
              src={logo}
              alt="logo"
              className="logo-img d-inline-block align-top"
              loading="lazy"
              style={{ width: "30px", height: "30px" }}
            />{" "}
            TALKS
          </a>
        </div>

        {/* toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#myNavBar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* notification */}
        <div className="navbar-collapse collapse" id="myNavBar">
          <ul className="navbar-nav">
            <li className="nav-item">
              <div className="nav-link">
                <FontAwesomeIcon icon={faBell} />
              </div>
            </li>

            {/* 
            <button type="button" class="btn btn-primary position-relative">
  Inbox
  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
    99+
    <span class="visually-hidden">unread messages</span>
  </span>
</button>
             */}

            {/* profile */}
            <li className="nav-item">
              <div className="nav-link">
                <ProfileModal />
              </div>
            </li>

            {/* search */}
            <li className="nav-item">
              <div className="nav-link d-flex">
                <input
                  className="form-control m-1"
                  type="search"
                  placeholder="Search by name/email"
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="btn btn-outline-success"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasExample"
                  aria-controls="offcanvasExample"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <Offcanvas nameList={nameList} />
    </div>
  );
};

export default Header;
