import '../../App.css';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateWalletInfo, setWalletConnectionStatus } from '../../store/actions/auth.actions';

function JoinIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const web3Modal = useSelector((state) => state.modal.web3Modal);

  const joinIn = () => {
    navigate('/payment-page')

  }

  const disconnect = async () => {
    try {
      await web3Modal.providerController.clearCachedProvider();
      dispatch(updateWalletInfo({}));
      dispatch(setWalletConnectionStatus(false));
    } catch (e) {
      console.log(" onClickDisconnect() exception : ", e);
    }
    navigate(-1)
  }

  return (
    <div className="signup h-screen">
      <div className='py-5 px-32 w-full h-18 border-b'>
        <img src='imgs/logo.png' alt="A" />
      </div>
      <div className='w-[370px] m-auto mt-20'>
        <h1 className='w-full text-center font-bold text-2xl text-[#000549]'>Join Kocoon</h1>
        <p className='my-2 text-sm text-center text-[#303C4F]'>Get started with Koccon by creating your profile</p>
        <div className='mt-10'>
          <p className='text-[#303C4F] text-sm my-2 px-1'>Display Name</p>
          <input className='rounded-lg w-full focus:border-[#864FD9] border-[#D3D8DE] border px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='rafiqur' />
          <p className='text-[#303C4F] text-sm my-2 px-1'>Email Address</p>
          <input className='rounded-lg w-full focus:border-[#864FD9] border-[#D3D8DE] border px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='rafiqur51@company.com' />
          <div className='mt-6 text-sm text-[#303C4F]'>
            <input type="checkbox" className='mr-2' /><span>I agree to the <span className='cursor-pointer text-[#ff6b57]'>Terms & Priavcy</span></span>
          </div>
          <button className='bg-[#6823D0] text-center px-4 py-3 text-white rounded-lg w-full mt-6' onClick={() => joinIn()} >Finish Sign-up</button>
          <button className='bg-[#F0F2F4] text-center px-4 py-3 text-[#303C4F] rounded-lg w-full mt-6' onClick={() => disconnect()}>Disconnect</button>

        </div>
      </div>
    </div>
  );
}

export default JoinIn;
