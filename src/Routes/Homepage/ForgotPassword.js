import React, { useState } from 'react';
import axios from "axios";
import "./home.css";
import { toast } from 'react-toastify';
import image from "../../images/reset_password.png"

const ForgotPassword = () => {

    const [email, setEmail] = useState('');

    function resetPassword(e) {
        e.preventDefault();
        console.log(email)
        axios.post("http://localhost:5000/api/user/forgot_password", { email: email })
            .then(res => toast(res.data?.Message))
            .catch((err) => toast(err.response?.data?.Message))
    }


    return (
        <div className='container-fluid row forgot-page-container'>
          <div className='reset-page-image col-md-5 col-10'>
            <img src={image} alt="forgot-password"/>
          </div>
            <div className='reset-form col-md-5 col-10'>

                <h3 className='form-heading'><u>Forgot Password</u></h3> <br/>
                <p className='form-text'>Enter your email id to get a Password reset link through email</p>

                <form action="" onSubmit={resetPassword}>

                    <div className="form-group">

                        <div className='row'>
                            <div className='col-12 col-lg-6 input-group'>
                                <span className="input-group-text" id="basic-addon1">@</span>
                                <input prefix='@' type="email" className="form-control input-area" id="userEmail" aria-describedby="emailHelp" placeholder="hello@xyz.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div >
                        </div> <br />
                        <div className='submit-btn-div'>
                            <button type='submit' onClick={resetPassword} className='btn forgot-submit-btn'>SUBMIT</button>
                        </div>
                    </div>
                </form>
            </div>

        </div >

    )
}

export default ForgotPassword