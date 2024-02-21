
import axios from "axios"
import { useContext } from "react"
import { chatContext } from "../context/ChatContext"

// chat loading
const SkeletonLoading = () => {
    return(
            <div className='card mb-2'>
                <div className='card-body-1 row'>
                    <div  className='loadingImage skeleton col-4'> </div>
                    <div className="profile-name col-8">
                      <div className="skeleton skeleton-text"> </div>
                      <div className="skeleton skeleton-text "> </div>
                    </div>
                </div>
            </div>
    )
}

// user list item
export const SearchResult = ({user , handleChat}) => {
  console.log('handle chat fn from offcanvas user',handleChat)
    return(
            <div className='card mb-2' onClick={handleChat} style={{cursor: 'pointer'}}>
                <div className='card-body-1 row'>
                    <div className='loadingRealImage col-4'> 
                    <span className='search-result-img-conatiner'>
                    <img className='search-result-profile-img' src={user.image} alt="profile-picture" />
                    </span>
                      </div>
                    
                    <div className="profile-name col-8">
                      <div className="user-name"> {user.name} </div>
                      <div className="user-email"> {user.email} </div>
                    </div>
                </div>
            </div>
    )
}

const Offcanvas = ({nameList}) => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"))
    const {user , setSelectedChat , chats , setChats , selectedChat} = useContext(chatContext)
    

    async function startChat (id){
        try {
         const chatData =  await axios.post('http://localhost:5000/api/chat', {userId:id} ,{
            headers:{
                "Content-type":"application/json",
                Authorization : `Bearer ${loggedInUser.token}`
            }
           })  
           if(!chats.find((cht)=> cht._id === chatData.data._id)){ // update chat with previous chat
                setChats([chatData.data,...chats])
           }
           setSelectedChat(chatData.data)
          //  console.log('selected chat',selectedChat)
        } catch (error) {
            console.log('error in start chat function',error);
        }
    }

  return (
    <div>
        <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">
            SEARCH RESULT
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {/* <div>
           <h3>search result</h3>
          </div> */}
         {/* skeleton loading component */}
         {
            nameList.length > 0 ?  nameList.map((user)=>{
               return <SearchResult user={user} key={user._id} handleChat={()=>startChat(user._id)} />
            }) : <SkeletonLoading />
         }
         
        </div>
      </div>
    </div>
  )
}

export default Offcanvas