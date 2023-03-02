import '../../App.css';
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useRef } from 'react';

function ResetPassword() {
  const [showPassowrd, setShowPassword] = useState(true)
  const [showConPassowrd, setShowConPassword] = useState(true)
  const [resetedPwd, setResetedPwd] = useState(false)
  const navigate = useNavigate();

  const resetPassword = () => {
    // navigate('/sendemail')
    setResetedPwd(true)
  }

  return (
    <div className="signin h-screen">
      <div className='py-5 px-32 w-full h-18 border-b'>
        <img src='imgs/logo.png' alt="A" />
      </div>
      {!resetedPwd ?
        <div className='w-[370px] m-auto mt-60'>
          <h1 className='w-full text-center font-bold text-2xl text-[#000549]'>Set new password?</h1>
          <p className='my-2 text-sm text-center text-[#303C4F]'>Enter your credentials to access your account</p>


          <div className='mt-10'>
            <div className='flex justify-between mt-6 mb-2'>
              <span className='text-[#303C4F] text-sm px-1 float-left  font-bold'>Password</span>
            </div>

            <div>
              <input className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='password' type={`${showPassowrd ? 'password' : 'text'}`} />
              <i className={`fa absolute -ml-6 mt-4 text-[#303C4F] cursor-pointer z-10 ${showPassowrd ? 'fa-eye' : 'fa-eye-slash'}`} onClick={() => setShowPassword(!showPassowrd)}></i>
            </div>

            <div className='flex justify-between mt-6 mb-2'>
              <span className='text-[#303C4F] text-sm px-1 float-left  font-bold'>Confirm new password</span>
            </div>

            <div>
              <input className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='password' type={`${showConPassowrd ? 'password' : 'text'}`} />
              <i className={`fa absolute -ml-6 mt-4 text-[#303C4F] cursor-pointer z-10 ${showConPassowrd ? 'fa-eye' : 'fa-eye-slash'}`} onClick={() => setShowConPassword(!showConPassowrd)}></i>
            </div>

            <button className='bg-[#6823D0] text-center px-4 py-3 text-white rounded-lg w-full mt-6' onClick={() => resetPassword()}>Reset Password</button>

          </div>
        </div>
        :
        <div>
          <div className='sm:w-[460px] w-[380px] m-auto mt-60'>
            <img src='imgs/success-icon.png' className='mx-auto' alt="A" />
            <h1 className='w-full text-center font-bold text-2xl text-[#000549] mt-10'>Password Reset</h1>
            <p className='my-2 text-center text-[#303C4F]'>Your password has been successfully reset. Click continue to login in your account</p>
            <div className='mt-10 rounded-lg mt-6 flex'>
              <button className='bg-[#6823D0] text-center px-4 py-3 text-white rounded-lg w-full mx-1' onClick={() => { navigate('/signin') }}>Login</button>
            </div>
          </div>
        </div>
      }

    </div>
  );
}

export default ResetPassword;
