import React , {useState} from 'react'
import * as yup from "yup";
import { useFormik } from "formik";
import image from '../../images/signup-img.avif'
// import pic from '../../images/sample.avif'
import {HashLoader} from "react-spinners"
import axios from 'axios';
import { toast } from 'react-toastify';


const Signup = () => {

  const[loading , setLoading] = useState(false);
  const[img , setImg] = useState();
  const [isDisabled , setIsDisabled] = useState(false);
  const[imgUrl , setImgUrl] = useState(null);
  const input_field = document.getElementById('profile_picture');

  // yup validation
  const signUpSchemaValidation = yup.object({
    userName: yup
      .string()
      .min(3, "name should have minimum 3 character")
      .required("Enter Your Name"),
    email: yup.string().email().required("Enter Email"),
    mobile: yup
      .string()
      .matches(/^[0-9]{10}/, "Enter valid mobile number")
      .required("Enter Mobile Number"),
    password: yup
      .string()
      .min(8, "enter minimum 8 character")
      .required("not valid"),
    confirmPassword: yup
      .string()
      .min(8, "enter minimum 8 character")
      .oneOf([yup.ref("password")], "Password Not Matched")
      .required("Enter Password to Confirm"),
  });

  //   formik
  const { values, handleSubmit, handleChange, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        userName: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        image:""
      },

      validationSchema: signUpSchemaValidation,
      onSubmit: async(newuser,{resetForm}) => {
        setIsDisabled((prev)=>!prev)
        await handleImage(newuser)
        // console.log(newuser);
        resetForm({newuser : " "})
      },
    });

   
// get uploaded image url from cloudinary
async function uploadImage(timestamp,signature){
  const data = new FormData();
  data.append("file",img);
  data.append("timestamp",timestamp);
  data.append("signature",signature);
  data.append("api_key",'554885775734427');
  data.append("folder",'images');

  try {
  //    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
     const url = `https://api.cloudinary.com/v1_1/sivakumar/image/upload`
     
     const res = await axios.post(url , data);
     const {secure_url} = res.data;
     console.log('bingooo..',secure_url)
     setImgUrl(()=>secure_url)
     console.log('from destructure',imgUrl)
  } catch (error) {
      console.log('ERROR IN UPLOADING IMAGE',error)
      setIsDisabled((prev) => !prev)
      input_field.value="";
  }
}

// get signature from server
async function getSignature(folder){
  try{
  // const res = await axios.post(`${process.env.BACKEND_URL}/sign-upload`,{folder});
  const res = await axios.post(`http://localhost:5000/api/sign-upload`,{folder});
  console.log('get sign data',res.data)
  return res.data
  } catch(error) {
  console.log('signature error' , error)
  setLoading(false);
  }
  }

  // upload image in cloudinary 
const handleImage = async(newuser) =>{
  try {
      setLoading(true)
      const {timestamp , signature} = await getSignature('images')
        console.log(timestamp,signature)
      await uploadImage(timestamp , signature);
      signUp(newuser)
  } catch (error) {
      console.log('error',error)
      toast.error('registration failed')
        toast.info('please try again')
        input_field.value="";
        setIsDisabled((prev) => !prev)
      setLoading(false)
  }
}

    // register user in DB
    async function signUp(user){
      try {
        console.log('image link' , imgUrl)
        await axios.post('http://localhost:5000/api/register-user',{
          name:user.userName,
          email:user.email,
          password:user.password,
          image:imgUrl
        })
        .then(res => {
          toast(res.data.message);
          console.log(res.data.message);
          values.userName = ''
          values.email = ''
          values.mobile = ''
          values.password = ''
          values.confirmPassword = ''
          input_field.value="";
          console.log('input field value',input_field.value)
        })
        .catch(err => {
          console.log('err',err)
          input_field.value="";
        })
        
        setLoading(false)
        setIsDisabled((prev) => !prev)
        
      } catch (error) {
        console.log(error)
        toast.error('registration failed')
        toast.info('please try again')
        input_field.value="";
        setIsDisabled((prev) => !prev)
        setLoading(false)
      }
    }
   
    


  return (
    <div>
        <div className='container'>
            <div className='row'>
                <div className='col-sm-12' id="sign-up-form">
                   {/* <form action="/" onSubmit={handleSubmit}> */}
                        <div className='form-group col-sm-12'>
                          <label htmlFor="userName">User Name</label>
                          <input type="text" className='form-control custom-input' placeholder='User Name' id="userName" value={values.userName} onChange={handleChange} onBlur={handleBlur} autoComplete='off' />
                          {touched.userName && errors.userName ? (<p className='signup-error-msg' style={{color:"red"}}>{errors.userName}</p>) : (<p className='signup-error-msg hidden-msg'>error</p>)}
                        </div>

                        <div className='form-group'>
                          <label htmlFor="email">Email</label>
                          <input type="email" className='form-control custom-input' placeholder='Email' id="email" value={values.email} onChange={handleChange} onBlur={handleBlur}  autoComplete='off' />
                          {touched.email && errors.email ? (<p className='signup-error-msg' style={{color:"red"}}>{errors.email}</p>) : (<p className='signup-error-msg hidden-msg'>error</p>)}
                        </div>

                        {
                        loading && <HashLoader
                        style={{zIndex:500}}
                        color="#36d7b7"
                       />
                       }

                        <div className='form-group'>
                          <label htmlFor="mobile">Mobile</label>
                          <input type="text" className='form-control custom-input' placeholder='Mobile Number' id="mobile" value={values.mobile} onChange={handleChange} onBlur={handleBlur}  autoComplete='off' />
                          {touched.mobile && errors.mobile ? (<p className='signup-error-msg' style={{color:"red"}}>{errors.mobile}</p>) : (<p className='signup-error-msg hidden-msg'>error</p>)}
                        </div>

                        <div className='form-group'>
                          <label htmlFor="password">Password</label>
                          <input type="password" className='form-control custom-input' placeholder='Password' id="password" value={values.password} onChange={handleChange} onBlur={handleBlur}  autoComplete='off' />
                          {touched.password && errors.password ? (<p className='signup-error-msg' style={{color:"red"}}>{errors.password}</p>) : (<p className='signup-error-msg hidden-msg'>error</p>)}
                        </div>

                        <div className='form-group'>
                          <label htmlFor="confirmPassword">Confirm Password</label>
                          <input type="password" className='form-control custom-input' placeholder='Confirm Password' id="confirmPassword" value={values.confirmPassword} onBlur={handleBlur}  onChange={handleChange} autoComplete='off' />
                          {touched.confirmPassword && errors.confirmPassword ? (<p className='signup-error-msg' style={{color:"red"}}>{errors.confirmPassword}</p>) : (<p className='signup-error-msg hidden-msg'>error</p>)}
                        </div>

                        <div className='form-group mb-2'>
                          <label htmlFor="profile_picture">Profile Picture</label>
                          <input type="file" className='form-control custom-input' accept="image/*" id="profile_picture" onChange={(e)=>setImg((prev)=>e.target.files[0])} alt='profile image' required />
                        </div>

                        
                        
                        

                        <div className='form-group m-1' style={{textAlign:'center'}}>
                            <button className='btn btn-success' type='submit' onClick={handleSubmit} disabled={isDisabled}>Register</button>
                        </div>
                    {/* </form>  */}

                </div>

            </div>

            <div id="signup-img-container" >
            <span className="signup-image-container" >
                <img src={image} alt='logo' />
            </span>
        </div>

        </div>
    </div>
  )
}

export default Signup