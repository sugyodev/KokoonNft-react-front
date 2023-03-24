import '../../App.css';
import { useLocation } from "react-router-dom";
import { useState} from 'react';
import { useSelector } from "react-redux";
import formValidation from '../../utils/formValidation';
import axios from 'axios';
import { toast } from 'react-toastify';

function SendEmail() {
  const sendEmailStatus = useSelector((state) => state.auth.sendEmailStatus);
  const [resent, setResent] = useState(false);

  const {state} = useLocation();
  const { email, password } = state; // Read values passed on state

  const openGmail = () => {
    window.open(`https://mail.google.com/mail/u/${email}/#search/from:Kocoon%20%3Ckocoonnft@gmail.com%3E`, "_blank");
  }

  /**
   * 
   * @returns Resend email for verify
   */
  const resend = () => {
    if (!formValidation("email", email)) {
      toast.warn("Email is invalidate.");
      return;
    }

    let paramsData = { email: email };
    axios.post(`/api/user/${sendEmailStatus === "forgot" ? "forgot_password" : "resend_email"}`, paramsData)
      .then((res) => {
        if (res.data.status) {
          toast.success("Resent email.");
        } else {
          toast.error("You are the unregistered user.")
        }
      }).catch((e) => {
        console.log(e);
        toast.error("An error occured from server.")
      })
  }

  const send = () => {
    setResent(false)
  }

  return (
    <div className="payment-success h-screen">
      <div className='py-5 px-32 w-full h-18 border-b'>
        <img src='/imgs/logo.png' alt="A" />
      </div>

      {!resent
          ?
          <div className='sm:w-[460px] w-[380px] m-auto mt-60'>
            <img src='/imgs/email-icon.png' className='mx-auto' alt="A" />
            <h1 className='w-full text-center font-bold text-2xl text-[#000549] mt-10'>{sendEmailStatus === 'signup' ? 'Let’s verify your email' : 'Sent you an email!'}</h1>
            {sendEmailStatus === 'signup'
              ?
              <p className='my-2 text-center text-[#303C4F] font-[500]'>Click the link in the email to verify your account. Check <a className='text-sm text-[#6823D0] ml-2 cursor-pointer font-bold' href='#'>{email} </a>and get started.</p>
              :
              <p className='my-2 text-center text-[#303C4F] font-[500]'>Click the link in the email to reset your password. Check<a className='text-sm text-[#6823D0] ml-2 cursor-pointer font-bold' href='#'>{email} </a>and create new password.</p>
            }
            <div className='mt-10 rounded-lg p-2 mt-6 flex'>
              <button className='bg-[#6823D0] text-center px-4 py-3 text-white rounded-lg w-1/2 mx-1 font-[500]' onClick={openGmail}>Open Gmail</button>
              <button className='bg-[#F0F2F4] text-center px-4 py-3 border text-[#303C4F] rounded-lg w-1/2 mx-1 hover:border-[#6823D0] hover:text-[#6823D0] font-[500]' onClick={resend}>Resend</button>
            </div>
          </div>
          :
          <div className='sm:w-[460px] w-[380px] m-auto mt-60'>
            <img src='/imgs/email-icon.png' className='mx-auto' alt="A" />
            <h1 className='w-full text-center font-bold text-2xl text-[#000549] my-4'>Didn’t receive an email or want to change?</h1>
            <p className='my-2 text-center text-[#303C4F] font-[500]'>If you want to edit your email, simply update it and resend it. The email may end up in your inbox or spam folder.</p>

            <p className='text-[#303C4F] font-bold mt-6 px-1 font-bold'>Email address</p>
            <input 
              className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='rafiqur51@company.com |' />

            <div className='mt-10 rounded-lg mt-6'>
              <button className='bg-[#6823D0] text-center px-4 py-3 text-white rounded-lg w-full font-[500]' onClick={send}>Resend</button>
            </div>
          </div>}
    </div>
  );
}

export default SendEmail;