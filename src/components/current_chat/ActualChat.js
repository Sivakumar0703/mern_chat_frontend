
import React, { useContext } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { chatContext } from '../context/ChatContext'

const ActualChat = ({message}) => {

const {user} = useContext(chatContext);

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
    // (message[idx].sender._id !== message[idx-1].sender._id || message[idx-1] === undefined) && message[idx].sender._id !== userId
    message[idx]?.sender._id !== message[idx-1]?.sender._id && message[idx]?.sender._id !== userId
  )
}

function setLeftMargin(message , currentMsg , idx , userId){
  return(
    !(message[idx]?.sender._id !== message[idx-1]?.sender._id && message[idx]?.sender._id !== userId) &&
    (currentMsg.sender._id !== user._id)
  )
}

  return (
<>
{/* <ScrollableFeed> */}
      {console.log('👉',message)}
      {message && message.map((CurrentMsg , idx)=>(
        // console.log('❌✔️same person / is last msg',isSamePerson(allMsg , CurrentMsg , idx ,user._id),isThisLastMessage(allMsg , idx , user._id));
            // className='d-flex flex-row align-items-end'
          
            <div key={CurrentMsg._id}  
            className={CurrentMsg.sender._id !== user._id ? 'd-flex flex-row align-items-end' : "d-flex flex-row align-items-end justify-content-end"} 
            style={{marginLeft:setLeftMargin(message , CurrentMsg , idx ,user._id) ? '35px' : ''}}
            >{
                 
                  // ( isSamePerson(message , CurrentMsg , idx ,user._id) || 
                  // isThisLastMessage(message , idx , user._id))
                  // && (
                  //   <img src={CurrentMsg.sender.image} id="sender-image" name={CurrentMsg.sender.name} alt="sender" style={{borderRadius:'50%',height:'35px',width:'35px',marginBottom:'15px'}}  />
                  // )} 
                  //  console.log(!(message[idx]?.sender._id !== message[idx-1]?.sender._id && message[idx]?.sender._id !== user._id) &&
                  //   (CurrentMsg.sender._id !== user._id))
                  (setSenderName(message , CurrentMsg , idx ,user._id))&&
                 (<img src={CurrentMsg.sender.image} id="sender-image" name={CurrentMsg.sender.name} alt="sender" style={{borderRadius:'50%',height:'35px',width:'35px',marginBottom:'15px'}}  />
      )}

                  <span 
                   className='m-1'
                  style={{
                    backgroundColor:CurrentMsg._id === user._id ? "#BEE3F8" : "#B9F5D0",
                    padding:'15px',
                    borderRadius:'8px',
                    maxWidth:'75%',
                    wordWrap:'break-word',
                    // marginLeft:setMargin(message,CurrentMsg,idx,user._id) 
                     marginLeft:setLeftMargin(message,CurrentMsg,idx,user._id) ? '35px' : '35px'
                   
                    }}>
                      <p style={{marginBottom:'0'}}>{setSenderName(message , CurrentMsg , idx ,user._id) ? <b>{CurrentMsg.sender.name}</b> : ""}</p>
                      {CurrentMsg.content}
                  </span>
                
            </div>
                ))}
    {/* </ScrollableFeed> */}
</>
  )
}

export default ActualChat