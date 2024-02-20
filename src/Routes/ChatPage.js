import React, { useContext, useEffect, useState } from "react";
import { chatContext } from "../components/context/ChatContext";
import Header from "../components/header/Header";
import PreviousChats from "../components/previousChats/PreviousChats";
import CurrentChat from "../components/current_chat/CurrentChat";
import './chatPage.css'


const ChatPage = () => {
  const { user } = useContext(chatContext);
  const box1 = document.getElementById('box-1');
  const box2 = document.getElementById('box-2');
  // const[getChatData , setGetChatData] = useState(false); // when user left the group the chat has to be updated

  function goToMyChats(){
    box2.classList.remove('activate-block')
    box1.classList.add('activate-block')
  }

  // useEffect(()=>{
  //   box1.classList.remove('activate-block')
  //   box2.classList.add('activate-block')
  // },[trigger])

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <Header />
        </div>
      </div>
      
      <div className="row chat-body" >
        <div className="col-12 col-md-4 my-chats" id="box-1">
         {/* <PreviousChats getChatData={getChatData} /> {/*  <FriendList />  */}
         <PreviousChats box1={box1} box2={box2}   />  {/* <FriendList />  */}
        </div>

        <div className="col-12 col-md-8 chat-box activate-block" id="box-2">
          {/* <button className="btn btn-danger" id="back-button" onClick={goToMyChats}>back</button> */}
          {/* <CurrentChat getChatData={getChatData}  setGetChatData={setGetChatData} />  {/* <ChatArea /> */}
          <CurrentChat handleFunction={goToMyChats} /> {/* <ChatArea /> */}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
