import React, { useContext , useEffect, useRef, useState } from "react";
import "./currentChat.css";
import { chatContext } from "../context/ChatContext";
import OneToOneChat from "../oneTooneChat/OneToOneChat";
import { HashLoader } from 'react-spinners';
import axios from 'axios';
import ActualChat from "./ActualChat";
import {io} from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faMessage } from "@fortawesome/free-solid-svg-icons";


const endPoint = "http://localhost:5000"
let  socket, selectedChatCopy;




const CurrentChat = ({ handleFunction }) => {
  const {user,selectedChat,chats,setSelectedChat,setChats,getChatData,setGetChatData,userLoading,notification,setNotification,notificationArray,setNotificationArray } = useContext(chatContext);
 

  // new
  const[loading , setLoading] = useState(false);
  const[fetchMsg , setFetchMsg] = useState([]);
  const[newMsg , setNewMsg] = useState("");// newMessage
  const[allMsg , setAllMsg] = useState([]);//messages
  let isMounted = false; // to make useEffect execute once
  const[socketConnection , setSocketConnection] = useState(false);
  const loggedInUser = JSON.parse(localStorage.getItem("user"))

  // state for typing indicator
  const [typing , setTyping] = useState(false);
  const [isTyping , setIsTyping] = useState(false);

    // file upload
    const[isFileUploading , setIsFileUploading] = useState(false);
 
 

      // send msg by pressing enter key
      async function sendMsg(event){
        
        if(event.key === "Enter" && newMsg ){
          socket.emit("stop_texting",selectedChat._id);
            try {
            const data = {
            msgContent : newMsg,
            chatId : selectedChat._id
            }
            setNewMsg("")
              const result =  await axios.post('http://localhost:5000/api/msg', data ,{
                    headers : {
                      "Content-Type":"application/json",
                      Authorization : `Bearer ${user.token}`
                    }
                })
                // console.log('send msg',result.data)
                // setNewMsg("")
                sendNotification(result.data.msg)
                socket.emit("new_msg",result.data.msg)
                
                 setAllMsg([...allMsg,result.data.msg])
                newMsg && setGetChatData((prev) => !prev)     
            } catch (error) {
               console.log('error in sending msg',error) 
               setNewMsg("")
              
            }
        }   
    }

 



    function handleChange(e){
    setNewMsg(e.target.value);
   
    // typing indicator 
      if(!socketConnection){ // if socket is not connected
        return;
      }

      if(!typing){
        setTyping(true);
        socket.emit("texting",selectedChat._id)
        // console.log('typing triggered')
      }
// console.log(typing , 'typinf')
      let lastTypingTime = new Date().getTime();
      // console.log(lastTypingTime , 'last')
      let timer = 5000;
      setTimeout(()=>{
        let currentTime = new Date().getTime();
        // let currentTime = lastTypingTime + 400;
        // console.log(currentTime , 'current')
        // console.log(currentTime - lastTypingTime , '>= 3000')
        let timeDifference = currentTime - lastTypingTime;

        if( timeDifference >= timer){
          socket.emit("stop_texting",selectedChat._id);
          setTyping(false);
          // console.log('close typing triggered')
        }
      },timer)    
    }

    // get entire chat
  async function getEntireChat(){
        if(!selectedChat){
          return;
        }
        try {
          const result = await axios.get(`http://localhost:5000/api/msg/${selectedChat._id}`,{
            headers : {
              Authorization : `Bearer ${loggedInUser.token}`
            }
          })
          // console.log('on chat loading',result.data.msg)
          setAllMsg(result.data.msg)
          // socket
          socket.emit('join_chat',selectedChat._id)
        } catch (error) {
          console.log('error in fetching entire chat',error)
        }
    }



        // socket
        useEffect(()=>{
          socketFn()
          // console.log('socket called')
        },[])

       

        async function sendNotification(newMsgReceived){
          if(selectedChatCopy._id === newMsgReceived.chat._id ){ // the selected user & the new msg sender are different person
            // if(!notificationArray.includes(newMsgReceived)){ // new
              // console.log("🚀before adding db",notificationArray) // new
              // setNotificationArray([newMsgReceived,...notificationArray]); // new
              // notificationArray.push(newMsgReceived) // old
              let msgSenderId =  newMsgReceived.sender._id;
            let notificationReceiver = newMsgReceived.chat.users.filter((person) => person._id !== msgSenderId ) 
            console.log("notification receiver",notificationReceiver)
              const data ={
                 notification:newMsgReceived ,
                userId:notificationReceiver,
               }
               await axios.patch('http://localhost:5000/api/user/update_notification',data,{
                headers : {
                  Authorization : `Bearer ${loggedInUser.token}`
                }
               })
              //updateLocalStorage(newMsgReceived) // new msg to local storage
              //  setGetChatData((prev) => !prev)

              //  refill notification
            // const yourDetail =  await axios.get(`http://localhost:5000/api/user/get_user/${loggedInUser._id}`);
            // console.log("data taken from db",yourDetail.data)
            // localStorage.setItem("user",JSON.stringify(yourDetail.data.user))
            // setNotificationArray(yourDetail.data.user.notification)
          //  } // new
          } 
        }

            // notification
            useEffect(()=>{
              //  console.log("➡️notification before adding new msg",notification) //✔️
              socket.on("msg_received",(newMsgReceived)=>{
                   if(!selectedChatCopy || selectedChatCopy._id !== newMsgReceived.chat._id ){ // the selected user & the new msg sender are different person
                      if(!notification.includes(newMsgReceived)){
                        setNotification([newMsgReceived , ...notification]); //✔️
                         updateLocalStorageUser([newMsgReceived , ...notification]); //✔️
                         setGetChatData((prev) => !prev)// ✔️
                         console.log("🚀🚀🚀")
                      }
                   } else {
                     setAllMsg([...allMsg , newMsgReceived])
                   }
             })
             
            })

           

            

    // load chat
    useEffect(()=>{
      getEntireChat()
      selectedChatCopy = selectedChat; // it's just to know whether to emit an event or send notification
    },[selectedChat])

    function updateLocalStorageUser(updatedNotification){
      let collectNotification = [];
      updatedNotification.forEach((notification)=>{
        console.log("each",notification)
        notification.sender._id !== loggedInUser._id && notification.chat.users.map((user)=>{
          if(user._id === loggedInUser._id){
            collectNotification.push(notification)
          }
        })
      })
      const userDetail = JSON.parse(localStorage.getItem("user"));
      userDetail.notification = collectNotification;
      localStorage.setItem("user",JSON.stringify(userDetail));
      console.log('new msg pushed into local notification',updatedNotification)
    }

    function updateLocalStorage(newmsg){
      console.log("local storage update fn called",newmsg)
      const storedNotification = loggedInUser.notification;
      console.log('previous',storedNotification)
      if(!storedNotification.includes(newMsg)){
        newmsg.sender._id !== loggedInUser._id && newmsg.chat.users.map((user)=>{
          if(user._id === loggedInUser._id){
            const userDetail = JSON.parse(localStorage.getItem("user"));
            userDetail.notification = [...userDetail.notification,newmsg]
            console.log("new notification",userDetail.notification)
            localStorage.setItem("user",JSON.stringify(userDetail));
            console.log('new msg pushed into local notification')
          }
        })
      }
    }







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

function socketFn(){
  const userDetail = JSON.parse(localStorage.getItem("user"));
  isMounted = true;
  socket = io(endPoint); 

  
  socket.emit("setUp" , userDetail); // to get user id

   socket.on("connected" , ()=>{
  setSocketConnection(true)

  socket.on("typing" , ()=>{
    setIsTyping(true);
    // console.log('typing true')
  })

  socket.on("stop_typing",()=>{
    setIsTyping(false);
    // console.log('typing false')
  })
})
}

let mediaFile ;
let fileType ;
let mediaUrl ;
const [isMediaUploading , setIsMediaUploading] = useState(false);

// handle upload files
 function handleFile(e){
  console.log("picture selected")
  console.log(e.target.files[0])
  console.log(e.target.files[0]?.type?.split("/")[0]) // image or video
  fileType = e.target.files[0]?.type?.split("/")[0];
  mediaFile = e.target.files[0];
  setIsMediaUploading(true);
  handleImage()
  setIsFileUploading(true)
}

async function sendFile(){
  // if(isFileUploading){
    socket.emit("stop_texting",selectedChat._id);
      try {

          const data = {
            msgContent : mediaUrl,
            chatId : selectedChat._id,
            isMedia : true,
            mediaType : fileType
            }
      
              const result =  await axios.post('http://localhost:5000/api/msg', data ,{
                    headers : {
                      "Content-Type": "application/json",
                      Authorization : `Bearer ${user.token}`
                    }
                })
                socket.emit("new_msg",result.data.msg)
                console.log('after updating msg' ,result.data.msg )
                 setAllMsg([...allMsg,result.data.msg])
                 setIsMediaUploading(false);
                //  setIsFileUploading(false)
        
      } catch (error) {
         console.log('error in sending msg',error) 
         setNewMsg("")
         setIsMediaUploading(false);
        //  setIsFileUploading(false)
      }

}

// get signature from server
async function getSignature(folder){
  try{
  const res = await axios.post(`http://localhost:5000/api/user/sign-upload`,{folder});
  console.log('get sign data',res.data)
  return res.data
  } catch(error) {
  console.log('signature error' , error);
  setIsMediaUploading(false);
  }
}


// cloudinary
async function handleImage(){
  try {
    if(fileType === "image" || fileType === "video"){
      const {timestamp , signature} = await getSignature('talks');
      await uploadMediaFile(timestamp , signature)
     sendFile()
    } else {
      alert("only images and videos can be shared");
      setIsMediaUploading(false);
    }
  } catch (error) {
    console.log("error",error)
    setIsMediaUploading(false);
  }
}

// upload in cloudinary
async function uploadMediaFile(timestamp,signature){
  const data = new FormData();
  console.log("media file" , mediaFile)
  data.append("file",mediaFile);
  data.append("timestamp",timestamp);
  data.append("signature",signature);
  data.append("api_key",'554885775734427');
  data.append("folder",'talks');

  const resource_type = fileType;
  console.log("resource type" , resource_type)
  const cloud_name = "sivakumar"
  try {
    const url = `https://api.cloudinary.com/v1_1/${cloud_name}/${resource_type}/upload` 
     const res = await axios.post(url , data);
     const {secure_url} =  res.data;
     console.log('bingooo..',secure_url)
     mediaUrl = secure_url;
  } catch (error) {
    console.log('ERROR IN UPLOADING IMAGE',error)
    setIsMediaUploading(false);
  }
}


  return (
    // <div className='container-fluid' style={{display:selectedChat?"flex":"none"}}>CurrentChat
    <div className="container-fluid inside-chat-area">
      <div className="row">
        {/* <div className='col-md-8 col-12'> */}
        <div className="col-12  ">
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
                <ActualChat message={allMsg} className="actual-chat-area" isTyping={isTyping} loading={isMediaUploading}  />
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
              {/* input field to type msg */}
              <div>{ isTyping ? <p style={{color:"#e0f2f1",marginBottom:"0rem"}}>typing...</p>: <p style={{marginBottom:"0rem"}}>👉</p>}</div>
                <div className="chat-input"> 
                   {/* <div style={{width:"90%"}}> */}
                   
                   <input
                      placeholder="Type Your Message"
                      value={newMsg}
                      onChange={handleChange}
                      onKeyDown={sendMsg}
                      // required
                    /> 
                    {/* </div>  */}

                  <div>
                  {/* send images */}
                  <label htmlFor="file-upload" className="m-1">
                  <i style={{color:"#009688"}}><FontAwesomeIcon className="send-media-icon" icon={faImage}  /></i>
                  <input type="file" id="file-upload" style={{display:"none"}} onChange={handleFile} accept="image/* ,video/*"  />
                  </label>
                 </div>
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
