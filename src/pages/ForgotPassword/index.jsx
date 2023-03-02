import '../../App.css';
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setSendEmailStatus } from '../../store/actions/auth.actions';

function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recoverPassword = () => {
    dispatch(setSendEmailStatus('resetpassword'));
    navigate('/sendemail')
  }

  return (
    <div className="signin h-screen">
      <div className='py-5 px-32 w-full h-18 border-b'>
        <img src='imgs/logo.png' alt="A" />
      </div>
      <div className='w-[370px] m-auto mt-60'>
        <h1 className='w-full text-center font-bold text-2xl text-[#000549]'>Forgot your password?</h1>
        <p className='my-2 text-center text-[#303C4F]'>Enter your credentials to access your account</p>

        <div className='mt-14'>
          <p className='text-[#303C4F] my-2 px-1  font-bold'>Email address</p>
          <input className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='rafiqur51@company.com' />

          <button className='bg-[#6823D0] text-center px-4 py-3 text-white rounded-lg w-full mt-8' onClick={recoverPassword}>Recover my password</button>

          <div className='text-center justify-center mt-6'>
            <span className='text-[#6E7B91]  font-semibold'>Already have an account?</span>
            <span className='font-bold text-[#864FD9] ml-2 cursor-pointer' onClick={() => navigate('/signin')}> Log in</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
