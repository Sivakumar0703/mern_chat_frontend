import React, { useContext , useEffect, useState } from "react";
import "./currentChat.css";
import { chatContext } from "../context/ChatContext";
import OneToOneChat from "../oneTooneChat/OneToOneChat";
import { HashLoader } from 'react-spinners';
import axios from 'axios';
import ActualChat from "./ActualChat";

const CurrentChat = ({ handleFunction }) => {
  const {user,selectedChat,chats,setSelectedChat,setChats,getChatData,setGetChatData,} = useContext(chatContext);

  // new
  const[loading , setLoading] = useState(false);
  const[fetchMsg , setFetchMsg] = useState([]);
  const[newMsg , setNewMsg] = useState("");// newMessage
  const[allMsg , setAllMsg] = useState([]);//messages
 

      // send msg by pressing enter key
      async function sendMsg(event){
        if(event.key === "Enter" && newMsg){
            try {
            const data = {
            msgContent : newMsg,
            chatId : selectedChat._id
            }

              const result =  await axios.post('http://localhost:5000/api/msg', data ,{
                    headers : {
                      "Content-Type":"application/json",
                      Authorization : `Bearer ${user.token}`
                    }
                })
                console.log('send msg',result.data)
                setNewMsg("")
                setAllMsg([...allMsg,result.data.msg])
            } catch (error) {
               console.log('error in sending msg',error) 
            }
        }   
    }

    function handleChange(e){
    setNewMsg(e.target.value);
    // typing indicator 
    }

    // get entire chat
  async function getEntireChat(){
        if(!selectedChat){
          return;
        }
        try {
          const result = await axios.get(`http://localhost:5000/api/msg/${selectedChat._id}`,{
            headers : {
              Authorization : `Bearer ${user.token}`
            }
          })
          console.log('on chat loading',result.data.msg)
          setAllMsg(result.data.msg)
        } catch (error) {
          console.log('error in fetching entire chat',error)
        }
    }

    // load chat
    useEffect(()=>{
      getEntireChat()
    },[selectedChat])

    function isSamePerson (message , currentMessage , idx , userId){
      return(
          idx < message.length-1 && 
        (message[idx+1].sender._id !== currentMessage.sender._id ||
        message[idx+1].sender._id === undefined) && 
        message[idx].sender._id !== userId
      )
}

function isThisLastMessage(messages , idx , userId){
return (
  idx === messages.length - 1 &&
  messages[messages.length - 1].sender._id !== userId &&
  messages[messages.length - 1].sender._id
)
}

function setMargin(messages , currentMessage , idx , userId){
  if( // upcoming msg are send my same person but not the user
    idx < messages.length - 1 && messages[idx+1].sender._id === currentMessage._id 
    && messages[idx].sender._id !== userId
  ){
    return 30;
  } else if (
    (idx < messages.length - 1 && messages[idx+1].sender._id !== userId) ||
    (idx === messages.length - 1 && messages[idx].sender._id !== userId)
  ){
    return 0;
  } else {
    return "auto";
  }
}

// previous msg = undefined || not sent by you
function setSenderName(message , currentMsg , idx , userId){
  return(
    (message[idx].sender._id !== message[idx-1].sender._id) 
  )
}






  return (
    // <div className='container-fluid' style={{display:selectedChat?"flex":"none"}}>CurrentChat
    <div className="container-fluid inside-chat-area">
      <div className="row">
        {/* <div className='col-md-8 col-12'> */}
        <div className="col-12">
          {/* <OneToOneChat getChatData={getChatData} SetGetChatData={SetGetChatData} /> */}
          <OneToOneChat handleFunction={handleFunction} setAllMsg={setAllMsg} />

          {/* new */}

          {
            selectedChat ? (<>
            {loading ? (
            <>
              <HashLoader color="#36d7b7" />
            </>
          ) : (
            <>
              <div className="text-and-display">
              <div className="chat-display d-flex flex-column">
                <ActualChat message={allMsg} className="actual-chat-area" />
                {/* actual chat start */}
               
       {/* {allMsg && allMsg.map((CurrentMsg , idx)=>(
        // console.log('❌✔️same person / is last msg',isSamePerson(allMsg , CurrentMsg , idx ,user._id),isThisLastMessage(allMsg , idx , user._id));

            <div key={CurrentMsg._id} className='m-2'>
                {
                  ( isSamePerson(allMsg , CurrentMsg , idx ,user._id) || 
                  isThisLastMessage(allMsg , idx , user._id))
                  && (
                    <img src={CurrentMsg.sender.image} id="sender-image" name={CurrentMsg.sender.name} alt="sender" style={{borderRadius:'50%',height:'35px',width:'35px'}}  />
                  )} 

                  <span 
                   className='m-2'
                  style={{
                    backgroundColor:CurrentMsg._id === user._id ? "#BEE3F8" : "#B9F5D0",
                    padding:'15px',
                    borderRadius:'8px',
                    maxWidth:'75%',
                    wordWrap:'break-word',
                    // marginLeft:setMargin(allMsg,CurrentMsg,idx,user._id) 
                   
                    }}>
                      {CurrentMsg.content}
                  </span>
                
            </div>
                ))} */}
                {/* actual chat end */}
                
              </div>
                <div className="chat-input"> 
                    <input
                      placeholder="Type Your Message"
                      value={newMsg}
                      onChange={handleChange}
                      onKeyDown={sendMsg}
                      required
                    />  
              </div>
              </div>
            </>
          )}
            </>)
            : " "
          }


          {/* end */}
        </div>
      </div>
    </div>
  );
};

export default CurrentChat;
