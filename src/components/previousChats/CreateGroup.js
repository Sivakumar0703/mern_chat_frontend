import React, { useContext, useState } from 'react'
import { chatContext } from '../context/ChatContext';
import axios from 'axios';
import SearchResultComponent from './SearchList';
import SelectedUserBadge from './SelectedUserBadge';





const CreateGroup = ({children}) => {
    const[search , setSearch] = useState('');
    const[SearchResult , setSearchResult] = useState([]);
    const[groupName , setGroupName] = useState('');
    const[selectedUsers , setSelectedUsers] = useState([]);
    const[loading , setLoading] = useState(false);
    const {user,chats,setChats} =  useContext(chatContext);

    // finding friends
    async function handleSearch(searchText){
        setSearch(searchText)
            try {
                setLoading(true)
                const result = await axios.get(`http://localhost:5000/api/user?search=${search}` , {
                    headers:{
                        Authorization : `Bearer ${user.token}`
                    }
                })
                setLoading(false)
                setSearchResult(result.data.users)
                // console.log(result.data.users)
            } catch (error) {
               console.log('error in fetching search result',error);
               setLoading(false) 
            }
    }

    // create new group
    async function handleSubmit(){
      if(groupName==='' || selectedUsers.length === 0){
        return alert('Can\'t leave fields empty')
      }

      // passing group name & members id
      const groupData = {
        groupName : groupName , // 
        users : JSON.stringify(selectedUsers.map((grpMembers) => grpMembers._id))
      }

     try {
       const result = await axios.post('http://localhost:5000/api/chat/create_group' , groupData ,{
        headers : {
          Authorization : `Bearer ${user.token}`
        }
       })
      //  console.log('forming froup', result)
      //  console.log('older chats',chats)
       setChats([result.data.fullChat , ...chats])
     } catch (error) {
      console.log('error in group submission',error)
     }

    }

    // adding group members
    function handleCreateGroup(user){
      // console.log('add user fn called',user)
        if(selectedUsers.includes(user)){
          return  alert('user already added')
        }
        setSelectedUsers([...selectedUsers , user])
    }

    // removing selected user
    function handleRemove(member){
        // console.log('handle remove user function called')
        setSelectedUsers(selectedUsers.filter((selected) => selected._id !== member._id))
    }

  return (
    <div>
        {/* trigger button */}
<span type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createGroupModal">
  {children}
</span>

{/* modal */}
<div className="modal fade" id="createGroupModal" tabIndex="-1" aria-labelledby="createGroupModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="createGroupModalLabel" style={{textAlign:'center'}}>Create Group Chat</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
         <div>
            <input placeholder='Enter Group Name' value={groupName} onChange={(e)=>setGroupName(e.target.value)}  />
         </div>
         <div>
         <input placeholder='Search for friends' onChange={(e)=>handleSearch(e.target.value)}  />
         </div>
         {/* selected users */}
         <div style={{display:'flex',flexWrap:'wrap'}}>
            {/* {console.log('selected users',selectedUsers)} */}
            { 
                selectedUsers.map((member)=>{
                    return <SelectedUserBadge key={member._id} user={member} handleFunction={()=>handleRemove(member)} />
                })
            }
            </div>

         {/* select users */}
         {loading ? <div><span>loading...</span></div> : (SearchResult?.slice(0,4).map((user)=>{
            return <SearchResultComponent key={user._id} user={user} handleFunction={()=>handleCreateGroup(user)} />
         }))}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary" onClick={handleSubmit}  data-bs-dismiss="modal" >Save changes</button>
      </div>
    </div>
  </div>
</div>
    </div>
  )
}

export default CreateGroup