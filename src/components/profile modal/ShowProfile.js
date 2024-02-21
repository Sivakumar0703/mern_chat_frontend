import React, { useContext, useState } from "react";
import './profileSection.css'
import { chatContext } from "../context/ChatContext";
import { faCheck, faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {CircleLoader} from 'react-spinners'
import { SearchResult } from "../header/Offcanvas";
// import SearchResultComponent from "../previousChats/SearchList";

const ShowProfile = ({ children , setAllMsg }) => {
  const {user, selectedChat, setSelectedChat , setGetChatData} = useContext(chatContext);
  const[isEditable , setIsEditable] = useState(false);
  const[updateGroupName , setUpdateGroupName] = useState("");
  const[loading , setLoading] = useState(false);
  const[search , setSearch] = useState("");
  const[addMember , setAddMember] = useState(); // users found from search


  async function editName(){
    try {
      setLoading(prev => !prev)
      const data = {
        groupChatId : selectedChat._id, 
        groupName : updateGroupName
      }
      const result = await axios.put('http://localhost:5000/api/chat/group_rename',data , {
        headers : {
          Authorization : `Bearer ${user.token}`
        }
      })
      setIsEditable(prev => !prev)
      setSelectedChat(result.data.rename)
      setGetChatData((prev) => !prev)
      setLoading(prev => !prev)
    } catch (error) {
      console.log('error in updating group name',error)
      setLoading(prev => !prev)
    }

  }

   async function handleSearch (){
    if (!search) {
      return alert("Please type something to search");
    }

    try {
      const result = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setAddMember(result.data.users);
      setSearch("")
    } catch (error) {
      console.log("error in finding friends to add in group", error);
    }
  };

  // add new member
  async function handleAddNewMember (newMember){
    try {     
        if(selectedChat.users.find((singleUser)=> singleUser._id === newMember._id)){
          setAddMember()
          return  alert("user already added");
        }
        
        const data = {
          groupChatId : selectedChat._id ,
          userId : newMember._id 
        }

        const result = await axios.put('http://localhost:5000/api/chat/group_add_member' , data , {
          headers : {
            Authorization : `Bearer ${user.token}`
          }
        } )
        // console.log('after adding new member',result.data.groupChat)
        setSelectedChat(result.data.groupChat)
        setAddMember()
       } catch (error) {
         console.log('error in adding new member to group' , error);
         setAddMember()
       }
  }

  // remove group member
  async function removeGroupMember (removeMember){
    try {
      if(selectedChat?.admin._id === removeMember._id){ // admin cant remove himself unless he tranfer the admin status
        return alert('admin cannot remove himself')
      }

      if( selectedChat?.admin._id !== user._id && user._id !== removeMember._id ){
        return alert('only admin can remove group members')
      }

      const data = {
        groupChatId : selectedChat._id ,
        userId : removeMember._id
      }

      const result = await axios.put('http://localhost:5000/api/chat/group_remove_member' , data , {
        headers : {
          Authorization : `Bearer ${user.token}`
        }
      })
      alert(`${removeMember.name} is removed from this group`)
      setSelectedChat(result.data.afterRemoved)
      getEntireChat(); // from current chat => load all msg
    } catch (error) {
      console.log('error in removing group member',error)
    }
  }

      // get entire chat
      async function getEntireChat(){
        if(!selectedChat){
          return;
        }
        try {
          const result = await axios.get(`http://localhost:5000/api/msg/${selectedChat._id}`,{
            headers : {
              Authorization : `Bearer ${user.token}`
            }
          })

          setAllMsg(result.data.msg)
        } catch (error) {
          console.log('error in fetching entire chat',error)
        }
    }

  return (
    <div className="d-inline-block">
      {/* Button trigger modal */}
      <span
        type="button"
        className="btn"
        data-bs-toggle="modal"
        // data-bs-target="#profileSectionModal"
        data-bs-target={selectedChat.isGroupChat? "#groupProfileModal" : "#profileSectionModal"}
      >
        {children}
      </span>

      {/* single profile modal */}
      <div
        className="modal fade"
        id="profileSectionModal"
        tabIndex="-1"
        aria-labelledby="profileSectionModalModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header" >
              <h1 className="modal-title fs-5 text-center" id="profileSectionModalModalLabel" style={{width:'100%'}}>
                PROFILE
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
            <div className="profile-image-container">
              <span className="profile-area">
               <img src={selectedChat.users[1].image} alt="profile" className="my-image" />
              </span>
            </div>
            <div>
              <span>Name :</span> &nbsp; <span>{selectedChat.users[1].name}</span>
            </div>
            <div>
              <span>Email :</span>&nbsp; <span>{selectedChat.users[1].email}</span>
            </div>
            </div>
            {/* <div className="modal-footer">
                <button className="btn btn-info" onClick={logout} >logout</button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div> */}
          </div>
        </div>
      </div>

            {/* modal */}
            <div
        className="modal fade"
        id="groupProfileModal"
        tabIndex="-1"
        aria-labelledby="groupProfileModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header" >
              <h1 className="modal-title fs-5 text-center" id="groupProfileModalLabel" style={{width:'100%'}}>
              {/* <span>Group Name :</span> &nbsp; */}
              {
                 !isEditable ? (
                 <span>{selectedChat.groupName} &nbsp;&nbsp; <span><FontAwesomeIcon icon={faPenToSquare} onClick={()=>setIsEditable(prev => !prev)} /></span>
                 </span>
                 )  : 
                 (<>
                 {loading ? <div className="d-flex justify-content-center align-items-center"><span><CircleLoader color="#36d7b7" /></span></div> : <>
                 <input value={updateGroupName} onChange={(e)=>setUpdateGroupName(e.target.value)} placeholder={selectedChat.groupName} /> &nbsp; 
                 <button className="btn btn-success" onClick={editName}><FontAwesomeIcon icon={faCheck} /></button>
                 </> }
                 </>) 
               } 

              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
            {/* <div className="profile-image-container">
              <span className="profile-area">
               <img src={selectedChat.users[1].image} alt="profile" className="my-image" />
              </span>
            </div> */}
            <div>
              <h3>Group members</h3>
              <p>Total Group Members : {selectedChat.users.length
              }</p>
              {
                selectedChat.users.map((member)=>{
                  return <div className="badge rounded-pill m-2 remove-badge" key={member._id} onClick={()=>removeGroupMember(member)} >{member.name} &nbsp; &nbsp;<span><FontAwesomeIcon icon={faXmark} /></span> </div> 
                })
              }
                <br />
              {/* add new members */}
              {/* {console.log('🚀')} */}
              {
                selectedChat?.admin?._id === user?._id ? 
                (<>
                <div className="d-flex mb-3">
                <input placeholder="search here" value={search} onChange={(e)=>setSearch(e.target.value)} /> &nbsp; &nbsp;
                <button className="btn btn-success" onClick={handleSearch}>search</button>
                </div>
                {addMember ? (<>
                {addMember?.map((user)=>{
                  return <SearchResult key={user._id} user={user} handleChat={()=>handleAddNewMember(user)} />
                })}
                </>) : " "}
                </>) 
                : " "
              }
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ShowProfile;
