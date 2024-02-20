

import React, { useContext , useState, useEffect } from 'react'
import { chatContext } from '../context/ChatContext'
import axios from 'axios';
import './previousChat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CreateGroup from './CreateGroup';


const PreviousChats = ({box1,box2}) => {
    const {user , selectedChat , chats , setSelectedChat , setChats , getChatData} = useContext(chatContext);
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    // fetch chat
    async function fetchChats(){
        try {
            
           const myChat = await axios.get('http://localhost:5000/api/chat',{
            headers:{
                Authorization: `Bearer ${loggedInUser.token}`
            }
           }) 
            
           setChats(myChat.data) // current chat
        } catch (error) {
            console.log('error in fetching chat',error);
        }
    }

     function getSenderName(loggedInUser , friend){
        if(friend[0]._id === loggedInUser._id){
            console.log('created chat- sender name',friend ,friend[1].name,friend[0].name )
            console.log('sender',friend[1].name)
        }
        
        return friend[0]._id === loggedInUser._id ? friend[1].name : friend[0].name
    }

    useEffect(()=>{
        console.log('rename success in my chat list - previous chat component')
            fetchChats()
    },[getChatData])

    function switchToChat() {
        box1.classList.remove('activate-block')
        box2.classList.add('activate-block')
    }

  return (
    // <div className='container-fluid'>
<>
<div className='row'>
{/* <div className='chat-container' style={{display : selectedChat ? "none" : "flex"}}> */}
<div className='chat-container col'>

    {/* header section */}
    <div className='previous-chat-header row'>
        <div className='col'>
        <p id="my-chat">MY CHATS</p>
        </div>
        <div className='col' id="create-group"> 
        <CreateGroup>
        <button className='btn btn-primary'>create group <FontAwesomeIcon icon={faPlus} />  </button>
        </CreateGroup>
        </div>
    </div>

    {/* friend list */} 
    {/* <div className='friends-list row' style={{overflowY:'scroll'}}> */}
    <div className='friends-list row'>
        <div className='col'>
            {console.log('chat to render frnd list' , chats)}
            {
                chats ? (
                    chats.map((cht)=>{
                        console.log('what i get' , cht)
                      return  <div 
                      key={cht._id}
                      onClick={()=>{
                        setSelectedChat(cht);
                        switchToChat()
                    }} // picking particular user
                      className='previous-chat-list'
                      >

                        <div className='my-chat-list'>
                        <div className='my-friends-profile'> 
                        <span className='my-friends-img-conatiner'> 
                        <img src={cht.users[1].image}  alt="profile-picture" />
                         </span>
                          </div>
                        <p style={{display:'inline-block',color:'#009688'}}>{!cht.isGroupChat ? (getSenderName(loggedInUser , cht.users)) : cht.groupName}</p> {/* cht.chatLabel */}
                        </div>

                        </div>
                    })
                ) : 'no chat available'
            }
        </div>

    </div>

</div>
</div>
  

</>
    // </div>
  )
}

export default PreviousChats