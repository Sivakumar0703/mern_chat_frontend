
import React, { useContext , useEffect , useRef, useState } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { chatContext } from '../context/ChatContext'
import "./currentChat.css"
import { ClipLoader } from 'react-spinners'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



const ActualChat = ({message , isTyping , loading }) => {

const {user} = useContext(chatContext);
const lastMsgRef = useRef(null);
const date = new Date()


  

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

// auto-scroll to bottom while receiving new msg
useEffect(()=>{
  lastMsgRef?.current?.scrollIntoView({behaviour:"smooth"})
},[message])

// time-stamp
function timeStamp(){
  let time;
  console.log(("00"+date.getHours().toString()).length)
  if(date.getHours().toString().length === 1){
    time = "0"+date.getHours()+":";
  } else {
     time = date.getHours()+":";
  }

  if(date.getMinutes().toString().length === 1){
    time = time + date.getMinutes();
  } else {
     time = time + date.getMinutes();
  }
  
    return time;
}

function downloadImage(link){
  let url = link
  let splitted = url.split("/")
  splitted.splice(6,0,"fl_attachment");
  let download_link = splitted.join("/");
  // window.open(download_link,"_blank");
  window.location.href = download_link;
}


  return (
<>
{/* {console.log('total chat length' , message.length , message)} */}
{/* {message.length == "1" ? <p style={{textAlign:"center"}}>date</p> : ""} */}
      {message && message.map((CurrentMsg , idx)=>(
        
            <div key={CurrentMsg._id}  
            className={CurrentMsg.sender._id !== user._id ? 'd-flex flex-row align-items-end' : "d-flex flex-row align-items-end justify-content-end"} 
            style={{marginLeft:setLeftMargin(message , CurrentMsg , idx ,user._id) ? '35px' : ''}}
            >{
                  (setSenderName(message , CurrentMsg , idx ,user._id))&&
                 (<img src={CurrentMsg.sender.image} id="sender-image" name={CurrentMsg.sender.name[0]} alt="sender" style={{borderRadius:'50%',height:'35px',width:'35px',marginBottom:'15px'}}  />
      )}
      
                  <div 
                   className='m-1'
                  style={{
                    backgroundColor:CurrentMsg.sender._id === user._id ? "#e0f2f1" : "#009688",
                    color:CurrentMsg.sender._id === user._id ? "#009688" : "#e0f2f1" ,
                    padding:'2px 10px',
                    borderRadius:'8px',
                    maxWidth:'75%',
                    wordWrap:'break-word',
                     marginLeft:setLeftMargin(message,CurrentMsg,idx,user._id) ? '35px' : '35px'
                   
                    }}>
                      <p style={{marginBottom:'0'}}>{setSenderName(message , CurrentMsg , idx ,user._id) ? <b>{CurrentMsg.sender.name}</b> : ""}</p>
                      {/* {CurrentMsg.isMedia?  */}
                        {/* // (CurrentMsg.mediaType == "image" ? (<div className='displayMediaFile'><img src={CurrentMsg.content} /></div>) 
                        // : ( CurrentMsg.mediaType == "video" ? (<div className='displayMediaFile'><video height="150px" width="150px" controls > <source src={CurrentMsg.content} /> </video></div> )
                        //  : "" ) ) : (<p>{CurrentMsg.content}</p>)
                      // <div className='displayMediaFile'><img src={CurrentMsg.content} /></div>) : <p>{CurrentMsg.content}</p>}
                      // <div className='displayMediaFile'><video height="150px" width="150px" controls > <source src={CurrentMsg.content} /> </video></div>) : <p>{CurrentMsg.content}</p>}

                      // <div className='displayMediaFile'><video height="150px" width="150px" controls > <source src={CurrentMsg.content} /> </video></div>) 
                      // : <p>{CurrentMsg.content}</p> */}
                      {/* } */}

{/* loading ? <ClipLoader color="#36d7b7" /> : */}

                      {
                        !CurrentMsg.isMedia? (<p>{CurrentMsg.content}</p>) : ""
                      }
                      {
                      //  CurrentMsg.isMedia && CurrentMsg.mediaType == "image"? (<div className='displayMediaFile'><img src={CurrentMsg.content} /></div>)  : ""
                       CurrentMsg.isMedia && CurrentMsg.mediaType == "image"? (<div className='displayMediaFile'><img src={CurrentMsg.content} />
                       <button className='btn' onClick={()=>downloadImage(CurrentMsg.content) }><i style={{color:"#152238"}}><FontAwesomeIcon icon={faDownload} /></i></button> </div>)  : ""
                      }
                      {
                      //  CurrentMsg.isMedia && CurrentMsg.mediaType == "video"? (<div className='displayMediaFile'><video height="100%" width="100%" controls > <source src={CurrentMsg.content} /> </video></div>)  : ""
                       CurrentMsg.isMedia && CurrentMsg.mediaType == "video"? (<div className='displayMediaFile'><video height="100%" width="100%" controls > <source src={CurrentMsg.content} /> </video></div>)  : ""
                      }
                     
                      <p style={{textAlign:'right' , opacity:'0.5',marginBottom:'0',fontSize:'10px'}}>{CurrentMsg.msgSentTime}</p>
                  </div>
                
            </div>

           
                ))}
                

                <div ref={lastMsgRef} className='mb-2' >{" "}</div>
</>
  )
}

export default ActualChat


