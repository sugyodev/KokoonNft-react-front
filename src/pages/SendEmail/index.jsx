import '../../App.css';
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";

function SendEmail() {
  const navigate = useNavigate();
  const sendEmailStatus = useSelector((state) => state.auth.sendEmailStatus);
  const [resent, setResent] = useState(false);
  const [pwdReseted, setPwdReseted] = useState(false);
  const openGmail = () => {
    window.open(`https://mail.google.com/mail/u/${"User Email"}/#search/from:Kocoon%20%3Ckocoonnft@gmail.com%3E`, "_blank");
    // if (sendEmailStatus === 'signup') {
    //   navigate('/select-package')
    // } else {
    //   setPwdReset()
    //   navigate('/resetpwd')
    // }
  }

  const resend = () => {
    setResent(true)
  }

  const send = () => {
    setResent(false)
  }

  const setPwdReset = () => {
    setPwdReseted(true)
  }

  return (
    <div className="payment-success h-screen">
      <div className='py-5 px-32 w-full h-18 border-b'>
        <img src='imgs/logo.png' alt="A" />
      </div>

      {!resent
          ?
          <div className='sm:w-[460px] w-[380px] m-auto mt-60'>
            <img src='imgs/email-icon.png' className='mx-auto' alt="A" />
            <h1 className='w-full text-center font-bold text-2xl text-[#000549] mt-10'>{sendEmailStatus === 'signup' ? 'Let’s verify your email' : 'Sent you an email!'}</h1>
            {sendEmailStatus === 'signup'
              ?
              <p className='my-2 text-center text-[#303C4F]'>Click the link in the email to verify your account. Check <a className='text-sm text-[#864FD9] ml-2 cursor-pointer font-bold' href='#'>Email </a>and get started.</p>
              :
              <p className='my-2 text-center text-[#303C4F]'>Click the link in the email to reset your password. Check<a className='text-sm text-[#864FD9] ml-2 cursor-pointer font-bold' href='#'>Email </a>and create new password.</p>
            }
            <div className='mt-10 rounded-lg p-2 mt-6 flex'>
              <button className='bg-[#6823D0] text-center px-4 py-3 text-white rounded-lg w-1/2 mx-1' onClick={openGmail}>Open Gmail</button>
              <button className='bg-[#F0F2F4] text-center px-4 py-3 border text-[#303C4F] rounded-lg w-1/2 mx-1 hover:border-[#6823D0] hover:text-[#6823D0]' onClick={resend}>Resend</button>
            </div>
          </div>
          :
          <div className='sm:w-[460px] w-[380px] m-auto mt-60'>
            <img src='imgs/email-icon.png' className='mx-auto' alt="A" />
            <h1 className='w-full text-center font-bold text-2xl text-[#000549]'>Didn’t receive an email or want to change?</h1>
            <p className='my-2 text-center text-[#303C4F]'>If you want to edit your email, simply update it and resend it. The email may end up in your inbox or spam folder.</p>

            <p className='text-[#303C4F] font-bold mt-6 px-1  font-bold'>Email address</p>
            <input className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='rafiqur51@company.com |' />

            <div className='mt-10 rounded-lg mt-6'>
              <button className='bg-[#6823D0] text-center px-4 py-3 text-white rounded-lg w-full' onClick={send}>Resend</button>
            </div>
          </div>}
    </div>
  );
}

export default SendEmail;
