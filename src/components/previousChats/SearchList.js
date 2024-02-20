
// const SearchResultComponent = ({user , handleFunction}) => {
//     console.log('handle chat fn from add user',handleFunction)
//       return(
//               <div className='card mb-2' onClick={handleFunction} style={{cursor: 'pointer'}}>
//                   <div className='card-body row'>
//                       <div className='loadingRealImage col-4'> 
//                       <span className='search-result-img-conatiner'>
//                       <img className='search-result-profile-img' src={user.image} alt="profile-picture" />
//                       </span>
//                         </div>
                      
//                       <div className="profile-name col-8">
//                         <div className="user-name"> {user.name} </div>
//                         <div className="user-email"> {user.email} </div>
//                       </div>
//                   </div>
//               </div>
//       )
//   }

// we haven't set the group chat profile image

  const SearchResultComponent = ({user , handleFunction}) => {
    console.log('handle chat fn from add user',handleFunction)
      return(
              <div className='card mb-2' onClick={handleFunction} style={{cursor: 'pointer'}}>
                  <div className='card-body row'>
                      <div className="profile-name col">
                        <div className="user-name"> {user.name} </div>
                        <div className="user-email"> {user.email} </div>
                      </div>
                  </div>
              </div>
      )
  }

  export default SearchResultComponent