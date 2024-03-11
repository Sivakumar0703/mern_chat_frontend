import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import axios from "axios";
import "./home.css"
import { useNavigate, useParams } from 'react-router-dom';
import image from "../../images/reset.png"

const ResetPassword = () => {

    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const navigate = useNavigate();
    const params = useParams();
    const verification = params.verification;
    const token = params.token;

    function reset(){
        console.log(verification , token)
        if(password !== cpassword){
            return toast("Confirm Password doesn't Match")
        }
        axios.patch(`http://localhost:5000/api/user/reset_password/${verification}/${token}` , {password})
        .then(res => {
            toast(res.data?.Message)
            setPassword('')
            setCpassword('')   
            })
        .catch(err => {
            toast(err.response?.data?.Message)
            setPassword('')
            setCpassword('')
        })
    }

    useEffect(()=>{
        const verification = params.verification;
        const data = {
            verificationCode:verification
        }
        axios.post("http://localhost:5000/api/user/verify_code" ,data)
        .then(res => toast(res.data.Message))
        .catch(err => {
            toast(err.response.data.Message)
            // navigate('*')
        })

    },[])

    return (
        <div className='reset-password-container row'>
            <div className='reset-password-form col-11 col-md-6'>
                <div>
                    <h3 className="m-3 title" >RESET PASSWORD</h3>
                </div>

                <div className='reset-img-container'>
                    <img src={image} alt="reset" />
                </div>

                <div className='reset-password-form'>
                    <label className="input-text m-1">ENTER NEW PASSWORD</label>
                    <div>
                        <input placeholder='Enter New Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <br/>
                    <label className="input-text m-1">CONFIRM PASSWORD</label>
                    <div>
                        <input  placeholder='Confirm Password' type='password' value={cpassword} onChange={(e) => setCpassword(e.target.value)} />
                    </div>
                    <br/>
                    <div className='m-3 reset-button d-flex' style={{justifyContent:"center"}}>
                        <button className='btn btn-warning' onClick={reset}>RESET</button>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default ResetPassword