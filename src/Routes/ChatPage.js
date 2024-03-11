import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { chatContext } from "../components/context/ChatContext";
import Header from "../components/header/Header";
import PreviousChats from "../components/previousChats/PreviousChats";
import CurrentChat from "../components/current_chat/CurrentChat";
import './chatPage.css'


const ChatPage = () => {
  let { user , userLoading , setNotificationArray } = useContext(chatContext);
  const box1 = document.getElementById('box-1');
  const box2 = document.getElementById('box-2');
  const[screenWidth  , setScreenWidth] = useState();
  let ScreenSize = "768";
  // const[getChatData , setGetChatData] = useState(false); // when user left the group the chat has to be updated

  function goToMyChats(){
    box2.classList.remove('activate-block')
    box1.classList.add('activate-block')
  }

  // useEffect(()=>{
  //   box1.classList.remove('activate-block')
  //   box2.classList.add('activate-block')
  // },[trigger])

  function updateScreenWidth(){
    setScreenWidth(window.outerWidth)
}

//   useEffect(()=>{
//     window.addEventListener('resize' , updateScreenWidth);

//     if(screenWidth < ScreenSize && (JSON.parse(localStorage.getItem('selectedUser')) === null) && box2.classList.contains("activate-block")){
//       box2.classList.remove('activate-block')
//       box1.classList.add('activate-block')
//     }
//     return() => {
//       window.removeEventListener('resize' , updateScreenWidth)
//     }
//  },[screenWidth])

//  set activate block initially
useEffect(()=>{
  const box1 = document.getElementById('box-1');
  const box2 = document.getElementById('box-2');
  async function refillNotification(){
    // refill notification after refresh/login
    const loggedInUser = JSON.parse(localStorage.getItem('user'))
    const you = await axios.get(`http://localhost:5000/api/user/get_user/${loggedInUser._id}`)
    setNotificationArray(you.data.user.notification);
   }
  refillNotification()
    if(JSON.parse(localStorage.getItem('selectedUser')) === null){
      box1.classList.add("activate-block")
    } else {
      box2.classList.add("activate-block")
    }
},[])




  return (
    <div className="container-fluid remove-default">
      <div className="row">
        <div className="col-12">
          <Header />
        </div>
      </div>
      
      <div className="row chat-body" >
        <div className="col-12 col-md-4 my-chats" id="box-1">
         {/* <PreviousChats getChatData={getChatData} /> {/*  <FriendList />  */}
         <PreviousChats box1={box1} box2={box2}   />  {/* <FriendList />  */}
        </div>

        <div className="col-12 col-md-8 chat-box" id="box-2">
          {/* <button className="btn btn-danger" id="back-button" onClick={goToMyChats}>back</button> */}
          {/* <CurrentChat getChatData={getChatData}  setGetChatData={setGetChatData} />  {/* <ChatArea /> */}
          {/* {console.log('user loading',userLoading)} */}
         { userLoading ?  <CurrentChat handleFunction={goToMyChats} /> : "loading..."}  {/* <ChatArea /> */}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
