
import axios from 'axios';
import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const chatContext = createContext()

const ChatContext = ({children}) => {
    const [user , setUser] = useState();
    const[userLoading , setUserLoading] = useState(false);
    const [selectedChat , setSelectedChat] = useState(JSON.parse(localStorage.getItem('selectedUser'))) // previous chat
    const [chats , setChats] = useState([]) // new/current chat => groups and friends
    const navigate = useNavigate();
    const[getChatData , setGetChatData] = useState(false); // when user left the group the chat has to be updated
    const [notification,setNotification] = useState([]);
    const[notificationArray , setNotificationArray] = useState([]); // newly created to manage db
   

  
    // get sender data (name,email,image)
    function getSenderData(loggedInUser , friend){
        return friend[0]._id === loggedInUser._id ? friend[1] : friend[0];
    } 
 
    useEffect(()=>{  
        // console.log('context effect loading')
        const userDetail = JSON.parse(localStorage.getItem("user"));
        // if there is no user data then send back the user to login page
        if(!userDetail){
            // navigate('/')
            
            setUserLoading(false);
         
        } else {
            // console.log('got user data')
           
            setUser(userDetail)
            setUserLoading(true);
            // console.log('user set')
        }   
    },[]) 

    // useEffect(()=>{
    //     const loggedInUser = JSON.parse(localStorage.getItem("user"));
    //     const data = {
    //         notification:notification,
    //         userId : loggedInUser._id
    //     }
        // axios.patch(`http://localhost:5000/api/user/update_notification` , data , {
        //     headers : {
        //         Authorization : `Bearer ${loggedInUser.token}`
        //     }
        // })
    // },[])

    
    
  return (
    <chatContext.Provider value={{user , setUser , selectedChat , setSelectedChat , chats , setChats
     , getChatData , setGetChatData , getSenderData , userLoading,setUserLoading,notification,
     setNotification,notificationArray , setNotificationArray }} >
        {children}
    </chatContext.Provider>
  )
}

 
export default ChatContext