
import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const chatContext = createContext()

const ChatContext = ({children}) => {
    const [user , setUser] = useState();
    const [selectedChat , setSelectedChat] = useState() // previous chat
    const [chats , setChats] = useState([]) // new/current chat
    const navigate = useNavigate();
    const[getChatData , setGetChatData] = useState(false); // when user left the group the chat has to be updated

  
    // get sender data (name,email,image)
    function getSenderData(loggedInUser , friend){
        return friend[0]._id === loggedInUser._id ? friend[1] : friend[0];
    } 
 
    useEffect(()=>{  
        const userDetail = JSON.parse(localStorage.getItem("user"));
        // if there is no user data then send back the user to login page
        if(!userDetail){
            navigate('/')
        } else {
            setUser(userDetail)
        }   
    },[]) 
    
  return (
    <chatContext.Provider value={{user , setUser , selectedChat , setSelectedChat , chats , setChats , getChatData , setGetChatData , getSenderData}} >
        {children}
    </chatContext.Provider>
  )
}

 
export default ChatContext