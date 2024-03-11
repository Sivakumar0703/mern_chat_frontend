import React, { useContext, useEffect, useState } from "react";
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
  const { user , notification , setSelectedChat , setNotification , notificationArray , setNotificationArray } = useContext(chatContext);
  const [nameList, setNameList] = useState([]);
  // const [notificationArray , setNotificationArray] = useState();
  const box1 = document.getElementById("box-1")
  const box2 = document.getElementById("box-2")
  const notificationfromLocal = JSON.parse(localStorage.getItem("user")).notification;
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
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
      setSearch("");
    } catch (error) {
      console.log("error in searching friends", error);
    }
  };

   function getUserName(loggedUser , userArray ){
    let findSender =  userArray?.filter((person)=> person._id !== loggedUser._id);
    return findSender[0].name
  }

  const [noti , setNoti] = useState([])
  //   function ready(){
  //   let notificationList = [];
  //   notification.map((msg) => {
  //     if(msg.chat.isGroupChat){
  //       notificationList.push(msg.chat.groupName)
  //     } else {
  //       notificationList.push( getUserName(user , msg.chat.users))
  //     }
  //   })
  //   console.log('notification order',notificationList)
  //   let recentNotification = notificationList.reverse();
  //   const obj = {};
  //   recentNotification.map((person)=>{
  //   if(obj[person]){
  //       obj[person] = obj[person] + 1;
  //   } else {
  //       obj[person] = 1;
  //   }
  //   })
  //   console.log('object',obj)
  //   setNoti(Object.entries(obj)) 
  // }

  function myMethod(){
    let container = [];
    notification.map((msg)=>{
      let myObj = []
      if(msg.chat.isGroupChat){
        // myObj[msg.chat._id] = `0*${msg._id}` // finally take group name with this id
        myObj.push(`g*${msg.chat._id}` , `0*${msg._id}`)
      } else {
        // myObj[msg.sender._id] = `0*${msg._id}`
        myObj.push(msg.sender._id , `0*${msg._id}`)
      }
      container.push(myObj)
    })
    //  console.log("✔️",container) //{id : count}
    // calculation msg count
    let result = {}
    container.reverse().map((sender)=>{
      if(result[sender[0]]){
        let value = result[sender[0]].split("*")
        value[0] = parseInt(value[0]) + 1;
        let updatedCount = `${value[0]}*${sender[1].split("*")[1]}` // value[0]-first msg(unread)
        result[sender[0]] = updatedCount;
      } else {
        let splitCountAndId = sender[1].split("*")
        result[sender[0]] = `1*${splitCountAndId[1]}`
      }
    })
    // console.log("✔️✔️",result)

    // get sender id , count , chat => [name , count , {}]
    let n = [];
    let senders = Object.keys(result)
    let countAndId = Object.values(result)
    for(let i=0; i<senders.length; i++){
      let temp = [];
      let name;
      notification.forEach((msg)=>{
        if(msg.sender._id === senders[i]){
          console.log('sender',msg.sender.name)
          return name = msg.sender.name
        } else if(senders[i][0]+senders[i][1] === "g*"){
          return name = msg.chat.groupName
        }
      });
       
      let splitCountAndId = countAndId[i].split("*");
      let count = splitCountAndId[0];
      let notificationId = splitCountAndId[1]
      let chat;
      notification.forEach((msg)=>{
        if(msg._id === notificationId){
          console.log('chat',msg.chat)
          return chat = msg.chat
        }
      })

      temp.push(name,count,chat)
      n.push(temp)
    }
    setNoti(n)
    
  }

  function notificationList(){
    let container = [];
      // notification.map((msg)=>{
        notificationfromLocal.map((msg)=>{
        let idAndmsg = []; // contains [sender/chat ID , message_count * notification_id
        if(msg.chat.isGroupChat){
          idAndmsg.push(`g*${msg.chat._id}` , `0*${msg._id}`); // g* to differentiate from single person message
        } else {
          idAndmsg.push(msg.sender._id , `0*${msg._id}`)
        }
        container.push(idAndmsg)
      })
  
      calculateNotificationMsg(container)
  }
  
  
  
  function calculateNotificationMsg(allNotificationArray){
    let result = {} // key => sender/chat ID & value => msg_count * notification_id
  
      allNotificationArray.reverse().map((sender)=>{
        if(result[sender[0]]){
          let value = result[sender[0]].split("*")
          value[0] = parseInt(value[0]) + 1;
          let updatedCount = `${value[0]}*${sender[1].split("*")[1]}` // value[0]-first msg(unread)
          result[sender[0]] = updatedCount;
        } else {
          let splitCountAndId = sender[1].split("*")
          result[sender[0]] = `1*${splitCountAndId[1]}`
        }
      })
     getDataFromId(result)
  }
  
  
  function getDataFromId(senderData){
  let finalNotificationList = [];
      let senders = Object.keys(senderData); //contains sender/chat id
      let countAndId = Object.values(senderData)
      for(let i=0; i<senders.length; i++){
        let temp = [];
        let name;
        // notification.forEach((msg)=>{
          notificationfromLocal.forEach((msg)=>{
          if(msg.sender._id === senders[i]){
            // console.log('sender',msg.sender.name)
            return name = msg.sender.name
          } else if(senders[i][0]+senders[i][1] === "g*"){
            return name = msg.chat.groupName
          }
        });
         
        let splitCountAndId = countAndId[i].split("*");
        let count = splitCountAndId[0];
        let notificationId = splitCountAndId[1]
        let chat;
        // notification.forEach((msg)=>{
          notificationfromLocal.forEach((msg)=>{
          if(msg._id === notificationId){
            // console.log('chat',msg)
            return chat = msg
          }
        })
  
        temp.push(name,count,chat)
        finalNotificationList.push(temp)
      }
      // let collectNotification = [];
      // finalNotificationList.forEach((notification)=>{
      //   notification[2].sender._id !== loggedInUser._id && notification[2].chat.users.map((user)=>{
      //     if(user._id === loggedInUser._id){
      //       collectNotification.push(notification)
      //     }
      //   })
      // })
      // console.log('👻',collectNotification)
      setNoti(finalNotificationList)
  }

  async function resetNotificationList(msg){
    tesst(msg[2])
    console.log('onclick notification',msg)
    setSelectedChat(msg[2].chat);
    // const newList = noti.filter((m) => m[2]._id !== msg[2]._id);
    // setNoti(newList);
    // const updatedNotificationList = notification.filter((m) => m._id !==  msg[2]._id)
    const updatedNotificationList = notification.filter((m) => m.chat._id !==  msg[2].chat._id) // this is for local storage
    //updateLocalStorageUser(updatedNotificationList) // this is for local storage
     //setNotification(updatedNotificationList) // this is for local storage
     const loggedInUser = JSON.parse(localStorage.getItem("user"));

    //  let msgSenderId =  msg[2].sender._id;
    //  let notificationReceiver = notification.chat?.users.filter((person) => person._id !== msgSenderId ) 
  //    const data = {
  //     notificationId:msg[2]._id,
  //     userId : loggedInUser._id
  // }
// const newListDb = notificationArray.filter((m) => m.chat._id !==  msg[2].chat._id)
let tempo;
const your_notification = await axios.get(`http://localhost:5000/api/user/get_user/${loggedInUser._id}`);
tempo = your_notification.data.user.notification;
//console.log("data in db ❤️",notificationArray) // new
const newListDb = tempo.filter((m) => m.chat._id !==  msg[2].chat._id)
//updateLocalStorageUser(newListDb) // ✔️
// setNotification(newListDb) // ✔️
console.log("on click notification-db upload",newListDb)
// setNotificationArray(newListDb)
const senderId = msg[2].sender._id;
const receiverId = msg[2].chat.users.filter((member) => member._id !== senderId)
  const myData = {
    userId : loggedInUser._id,
    notification : newListDb
  }
  await axios.patch(`http://localhost:5000/api/user/remove_notification` , myData , {
      headers : {
          Authorization : `Bearer ${loggedInUser.token}`
      }
  })

//  const your_data = await axios.get(`http://localhost:5000/api/user/get_user/${loggedInUser._id}`);
//  localStorage.setItem("user",JSON.stringify(your_notification.data.user))
// setNotificationArray(your_notification.data.user.notification)



    box1.classList.remove('activate-block')
        box2.classList.add('activate-block')
        if(localStorage.getItem('selectedUser')){
            localStorage.setItem('selectedUser',JSON.stringify(msg[2].chat));
        } else {
            localStorage.setItem('selectedUser',JSON.stringify(msg[2].chat));
        }
  }

  function updateLocalStorageUser(updatedNotification){
    console.log("local",updatedNotification)
    const userDetail = JSON.parse(localStorage.getItem("user"));
    userDetail.notification = updatedNotification;
    localStorage.setItem("user",JSON.stringify(userDetail));
  }

  useEffect(()=>{
      // ready()
      // myMethod()
      notificationList()
  },[notification])

  function tesst(notif){
    // setSelectedChat(notif.chat);
    setNotification(notification.filter((n)=> n.chat._id !== notif.chat._id))
    updateLocalStorageUser(notification.filter((n)=> n.chat._id !== notif.chat._id))
  }

  return (
    <div className="container-fluid header">
      <nav className="navbar navbar-expand-lg navbar-light navigation ">
        {/* logo */}
        <div className="my-logo">
          <a href="#" className="navbar-brand">
            <img
              src={logo}
              alt="logo"
              className="logo-img d-inline-block align-top"
              loading="lazy"
              style={{ width: "30px", height: "30px"}}
            />{" "}
            <span style={{color:"#009688"}}>TALKS</span>
          </a>
        </div>

        {/* toggle button */}
        <button
          className="navbar-toggler m-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#myNavBar"
          style={{backgroundColor:"#009688"}}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* notification */}
        <div className="navbar-collapse collapse" id="myNavBar">
          <ul className="navbar-nav">
            <li className="nav-item">
              <div className="nav-link">
                {/* <button className="btn" style={{backgroundColor:"#e0f2f1"}}>  */}
                {/* <button className="btn"> 
                <i style={{color:"#009688",fontSize:"20px"}}>  <FontAwesomeIcon icon={faBell} /> </i>
                </button> dropdown-toggle*/}


                <div className="dropdown">
  <button className="btn btn-secondary bell-btn icon-button" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{border:"none"}}>
  <i  style={{color:"#009688",fontSize:"22px"}} >  <FontAwesomeIcon icon={faBell} /> 
  {
    noti.length ? 
    // <span className="position-absolute translate-middle p-2 bg-danger border border-light rounded-circle">{noti.length}
    //  <span style={{color:"white"}}></span> 
    <span className="icon-button-badge"> {noti.length} </span>
  
    : " "
  }

  {
  }
  </i>
  </button>
  <ul className="dropdown-menu">
    {noti.length === 0 ? <span style={{color:"black",padding:"15px"}}>No New Msg</span> :""}
    {/* {notification.map((msg)=>(
      <li key={msg._id} onClick={()=>tesst(msg)}>
        <a className="dropdown-item" href="#" key={msg.email}>
          {msg.chat.isGroupChat ? <span style={{color:"black",padding:"15px"}}>{msg.chat.groupName}</span> : <span style={{color:"black",padding:"15px"}}>{getUserName(user , msg.chat.users)}</span> }
        </a>
      </li>
    ))} */}

{noti.map((msg)=>(
       
      //<li key={msg[2]._id} onClick={()=>tesst(msg)}>
      <li key={msg[2]._id} onClick={()=>resetNotificationList(msg)}>
        <a className="dropdown-item" href="#" key={msg[2]._id+msg[2].createdAt}>
          {<span style={{color:"black",padding:"15px"}}>{`${msg[0]} - ${msg[1]}`}</span> }
        </a>
      </li>
    ))}
    
    {console.log('noti 🔔',noti)}
   
  
  </ul>
</div>



















              
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
