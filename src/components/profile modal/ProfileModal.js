import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPenToSquare, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { chatContext } from "../context/ChatContext";
import "./profileSection.css";
import axios from "axios";
import { toast } from 'react-toastify';

const ProfileModal = () => {
  const {user , setUser} = useContext(chatContext);
  // const [email , setEmail] = useState("");
  const[image,setImage] = useState();
  const[trigger,setTrigger] = useState(false);
  // const[newImageUrl , setNewImageUrl] = useState("")
  const navigate = useNavigate();

    function logout() {
        // localStorage.removeItem("user");
        localStorage.clear()
        navigate('/');
    }

    // change email
    // function changeEmail(){
    //   if(email.length === 0){
    //     return alert("please enter your new email id to change")
    //   }
    //   let regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    //   let result = regex.test(email);

    //   if(result){
    //     console.log(result,email)
    //     let data = {
    //       newMailId:email,
    //     }
    //    let result =  axios.patch('http://localhost:5000/api/user/update-user-email',data,{
    //       headers : {
    //         Authorization : `Bearer ${user.token}`
    //       }
    //     } )

    //     console.log(result.data)
    //   }else{
    //     return alert("invalid email format")
    //   }

    // }

    // Change Profile Picture
    const changeProfilePicture = async(newImageUrl) => {
      try {
        console.log('new image url',newImageUrl)
        setImage("")
        const data = {
          newImageUrl:newImageUrl
        }
        const result = await axios.patch('http://localhost:5000/api/user/update-profile-picture',data,{
          headers : {
            Authorization : `Bearer ${user.token}`
          }
        })
        const previous_user_data = JSON.parse(localStorage.getItem("user"))
        previous_user_data.image = newImageUrl;
        const updated_user_data = {...previous_user_data , image:newImageUrl}
        localStorage.setItem("user",JSON.stringify(updated_user_data))
        setTrigger((prev) => !prev)
        console.log(result.data);
        console.log("❌❌❌",newImageUrl)
      } catch (error) {
        console.log("error in updating profile image",error)
      }
    }

    useEffect(()=>{
      const updated_user_data = JSON.parse(localStorage.getItem("user"))
      setUser(updated_user_data);
    },[trigger])

    const handleImage = async() =>{
      try {
         const input_value = document.getElementById('user-profile-pic');
         input_value.value="";
          const {timestamp , signature} = await getSignature('images')
            console.log(timestamp,signature)
          await uploadImage(timestamp , signature);
          
          
      } catch (error) {
          console.log('error',error)
          toast.error('update image failed')

      }
    }

   // get signature from server
 async function getSignature(folder){
  try{
  const res = await axios.post(`http://localhost:5000/api/user/sign-upload`,{folder});
  console.log('get sign data',res.data)
  return res.data
  } catch(error) {
  console.log('signature error' , error)
  }
}

// get uploaded image url from cloudinary
async function uploadImage(timestamp,signature){
  console.log("image file",image)
  const data = new FormData();
  data.append("file",image);
  data.append("timestamp",timestamp);
  data.append("signature",signature);
  data.append("api_key",'554885775734427');
  data.append("folder",'images');

  try {
     const url = `https://api.cloudinary.com/v1_1/sivakumar/image/upload`    
     const res = await axios.post(url , data);
     const {secure_url} = res.data;
     console.log('bingooo..',secure_url)
    //  setNewImageUrl(()=>secure_url)
    //  setNewImageUrl(()=>secure_url)
    await changeProfilePicture(secure_url)
  } catch (error) {
      console.log('ERROR IN UPLOADING IMAGE',error)
  }
}

  return (
    <div>
      {/* Button trigger modal */}
      <button
        type="button"
        className="btn"
        data-bs-toggle="modal"
        data-bs-target="#userProfileModal"
        // style={{backgroundColor:"#e0f2f1"}}
      >
        <i style={{color:"#009688",fontSize:"20px"}}> <FontAwesomeIcon icon={faUser} />  </i>
      </button>

      {/* modal */}
      <div
        className="modal fade"
        id="userProfileModal"
        tabIndex="-1"
        aria-labelledby="userProfileModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="userProfileModalLabel" style={{textAlign:"center"}}>
               {user?.name} - {user?.email}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            {/* modal body */}
            <div className="modal-body">
                
                <div className="user-image">
                    <img src={user?.image} alt="profile" />
                    {/* {console.log('user url',user?.image)} */}
                </div>
                <div className="edit-buttons-container">
                    <input type="file"   id="user-profile-pic" accept="image/*" onChange={(e)=>setImage(e.target.files[0])}  />
                    <button className="btn btn-success m-1" onClick={handleImage}>
                       <i >
                    <FontAwesomeIcon icon={faPenToSquare} />
                    </i> &nbsp; update
                    </button>
                </div>
                <hr/>

                {/* <div>
                  <input placeholder={user?.email} value={email} onChange={(e)=>setEmail(e.target.value)} type="email" />&nbsp;
                  <button className="btn btn-info m-1" onClick={changeEmail}>
                  <i >
                  <FontAwesomeIcon icon={faEnvelope} />
                    </i> &nbsp;
                    Change Email
                    </button>
                </div> */}
                
               
            </div>
            <div className="modal-footer">
                <button className="btn btn-danger" onClick={logout} data-bs-dismiss="modal" ><i><FontAwesomeIcon icon={faRightFromBracket} />&nbsp;</i>logout</button>
              {/* <button type="button" className="btn btn-primary">
                Save changes
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
