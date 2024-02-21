import React, { useContext, useEffect , useState } from 'react'
import { chatContext } from '../context/ChatContext'
// import ChatSettings from './ChatSettings'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowLeft, faCircleChevronLeft, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import ShowProfile from '../profile modal/ShowProfile'
import '../../App.css';
// import { HashLoader } from 'react-spinners'
import axios from 'axios'

const OneToOneChat = ({handleFunction , setAllMsg}) => {
    const {user , selectedChat  , setSelectedChat , getChatData , setGetChatData } = useContext(chatContext);
    const[switchBackButton , setSwitchBackButton] = useState(false);
    const ScreenSize = '768';
    // const[loading , setLoading] = useState(false);
    // const[fetchMsg , setFetchMsg] = useState([]);
    // const[newMsg , setNewMsg] = useState("");
    // const[allMsg , setAllMsg] = useState([])
    // console.log('selected chat from chat box',selectedChat)

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
       }else{
        setSwitchBackButton(false)
       }

       return() => {
         window.removeEventListener('resize' , updateScreenWidth)
       }

    },[screenWidth])

    // send msg by pressing enter key
//   async function sendMsg(e){
//         if(e.key === "Enter" && newMsg){
//             try {
// const data = {
//     content : newMsg,
//     chatId : selectedChat._id
// }

//               const result =  await axios.put('http://localhost:5000/api/msg', data ,{
//                     headers : {
//                         "Content-Type":"application/json",
//                         Authorization : `Bearer ${user.token}`
//                     }
//                 })
//                 console.log('send msg',result.data)
//                 // setNewMsg("")
//                 // setAllMsg([...allMsg,result.data])
//             } catch (error) {
//                console.log('error in sending msg',error) 
//             }
//         }   
//     }

//     function handleSendMsg(e){
//             setNewMsg(e.target.value);
//             // typing indicator 
//     }

{/* <div className='d-flex justify-content-between align-items-center p-1 current-chat-header' > */}

  return (

    <div>
        {selectedChat ? (
           
            <div className='p-1 current-chat-header d-flex justify-content-between align-items-center' >
                {
                    switchBackButton ? (<span className='go-back-btn' style={{cursor:'pointer'}} onClick={handleFunction}> <FontAwesomeIcon icon={faCircleChevronLeft} /> </span>) 
                    : (<span className='go-back-btn' style={{cursor:'pointer'}} onClick={() => setSelectedChat("")}> <FontAwesomeIcon icon={faCircleArrowLeft} /> </span>)
                }

                { 
                    selectedChat.isGroupChat? <span className='chat-person-name'> {selectedChat.groupName} </span> : <span className='chat-person-name'> {getSenderName(user,selectedChat.users)} </span>
                }

                {!selectedChat.isGroupChat? (
                    <ShowProfile setAllMsg={setAllMsg}>
                    <FontAwesomeIcon icon={faCircleInfo}  />
                    </ShowProfile>)
                 : (
                    <ShowProfile setAllMsg={setAllMsg}>
                    <FontAwesomeIcon icon={faCircleInfo} />
                    </ShowProfile>
                 )}
            
                 {/* changes end */}
                 {/* <UpdateGroupChatModal getChatData={getChatData} SetGetChatData={SetGetChatData} /> */}
                 {/* chating area */}
                
            </div>          
        ) : (
            <div className='d-flex justify-content-center align-items-center' style={{height:'70vh'}}>
                <p>click on a user to start chatting</p>
            </div>
        ) }

        

        



        

    </div>
  )
}

export default OneToOneChat