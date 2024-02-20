import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const SelectedUserBadge = ({user , handleFunction}) => {
  return (
    <div onClick={handleFunction} className='p-1 mb-1 badge rounded-pill text-bg-success' style={{cursor:'pointer',backgroundColor:'purple',borderRadius:'5px',margin:'5px'}}>
            {/* <span style={{color:'white',margin:'5px',padding:'5px'}}>{user.name}</span>
            <span> <FontAwesomeIcon icon={faXmark} color='red' style={{padding:'5px'}} /> </span> */}
            <div style={{display:'flex'}}>
              <span style={{padding:'5px'}}> {user.name.toUpperCase()} </span>
              <span style={{padding:'5px'}}> <FontAwesomeIcon icon={faXmark} color='red' /> </span>
            </div>
    </div>
  )
}

export default SelectedUserBadge