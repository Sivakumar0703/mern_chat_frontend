
import React, { useContext } from 'react'
import './currentChat.css'
import { chatContext } from '../context/ChatContext'
import OneToOneChat from '../oneTooneChat/OneToOneChat'

const CurrentChat = ({handleFunction}) => {
    const {user , selectedChat , chats , setSelectedChat , setChats ,getChatData, setGetChatData} = useContext(chatContext)
  return (
    // <div className='container-fluid' style={{display:selectedChat?"flex":"none"}}>CurrentChat
    <div className='container-fluid' >
    <div className='row'>
        {/* <div className='col-md-8 col-12'> */}
        <div className='col-12'>
          {/* <OneToOneChat getChatData={getChatData} SetGetChatData={SetGetChatData} /> */}
          <OneToOneChat handleFunction={handleFunction} />
        </div>

    </div>
    </div>
  )
}

export default CurrentChat