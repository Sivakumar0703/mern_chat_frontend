import React, { useContext, useEffect , useState } from 'react'
import { chatContext } from '../context/ChatContext'
// import ChatSettings from './ChatSettings'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowLeft, faCircleChevronLeft, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import ShowProfile from '../profile modal/ShowProfile'
import '../../App.css';

const OneToOneChat = ({handleFunction}) => {
    const {user , selectedChat  , setSelectedChat , getChatData , setGetChatData } = useContext(chatContext);
    const[switchBackButton , setSwitchBackButton] = useState(false);
    const ScreenSize = '768'
    console.log('selected chat from chat box',selectedChat)

    function getSenderName(loggedInUser , friend){
        return friend[0]._id === loggedInUser._id ? friend[1].name : friend[0].name
    }

    function getSenderData(loggedInUser , friend){
        return friend[0]._id === loggedInUser._id ? friend[1] : friend[0];
    }

    
    const[screenWidth  , setScreenWidth] = useState();

    function updateScreenWidth(){
        setScreenWidth(window.outerWidth)
    }

    useEffect(()=>{
       window.addEventListener('resize' , updateScreenWidth);
       if(screenWidth < ScreenSize){
        setSwitchBackButton(true)
        console.log('🦄',switchBackButton)
       }else{
        setSwitchBackButton(false)
       }

       return() => {
         window.removeEventListener('resize' , updateScreenWidth)
       }

    },[screenWidth])

  return (

    <div>
        {selectedChat ? (
            <>
            <div className='d-flex justify-content-between align-items-center p-1 current-chat-header' >
                {
                    switchBackButton ? (<span className='go-back-btn' style={{backgroundColor:'yellow',cursor:'pointer'}} onClick={handleFunction}> <FontAwesomeIcon icon={faCircleChevronLeft} /> </span>) 
                    : (<span className='go-back-btn' style={{backgroundColor:'blue',cursor:'pointer'}} onClick={() => setSelectedChat("")}> <FontAwesomeIcon icon={faCircleArrowLeft} /> </span>)
                }
                {/* {!selectedChat.isGroupChat? (
                <>{getSenderName(user,selectedChat.users)}
                    <ShowProfile>
                    <FontAwesomeIcon icon={faCircleInfo} />
                    </ShowProfile>
                </>)
                 : (
                 <>{selectedChat.groupName}</>
                 ) } */}
                 {/* changes start */}
                 {!selectedChat.isGroupChat? (
                <><span className='chat-person-name'> {getSenderName(user,selectedChat.users)} </span>
                    <ShowProfile>
                    <FontAwesomeIcon icon={faCircleInfo} />
                    </ShowProfile>
                </>)
                 : (
                 <><span className='chat-person-name'> {selectedChat.groupName} </span>
                 <ShowProfile>
                    <FontAwesomeIcon icon={faCircleInfo} />
                    </ShowProfile>
                 </>
                 )  }
                 {/* changes end */}
                 {/* <UpdateGroupChatModal getChatData={getChatData} SetGetChatData={SetGetChatData} /> */}
            </div>
            </>
        ) : (
            <div className='d-flex justify-content-center align-items-center' style={{height:'70vh'}}>
                <p>click on a user to start chatting</p>
            </div>
        ) }
    </div>
  )
}

export default OneToOneChat