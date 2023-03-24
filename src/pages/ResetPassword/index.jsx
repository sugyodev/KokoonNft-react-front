import '../../App.css';
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useRef, useEffect } from 'react';
import formValidation from '../../utils/formValidation';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { updateUserInfo } from '../../store/actions/auth.actions';
import { useDispatch } from 'react-redux';

function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pwd, setPwd] = useState("");
  const [content, setContent ] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [resetedPwd, setResetedPwd] = useState(false)
  const [showPassowrd, setShowPassword] = useState(true)
  const [showConPassowrd, setShowConPassword] = useState(true)
  const [cookies, setCookie] = useCookies(['user']);
  
  useEffect(() => {
    const fragment = new URLSearchParams(window.location.search.slice(1));
    const tParam = fragment.get("t");
    setContent(tParam);
  }, [window.location])


  /**
   * 
   * @returns Reset password
   */
  const resetPassword = () => {
    if (!formValidation("password", pwd) || !formValidation("password", confirmPwd)){
      toast.warn("Password length should be more than 6.");
      return;
    }
    if (pwd !== confirmPwd){
      toast.warn("The passwords are not matched.")
      return;
    }
    let paramData = {
      content : content,
      pwd: pwd,
    }
    axios.post("/api/user/reset_password", paramData)
      .then((res) => {
        if (res.data.status){
          const user = res.data.user;
          setCookie('Email', user.email, { path: '/signin' });
          setCookie('Password', user.pwd, { path: '/signin' });
          setCookie('LoginType', 1, { path: '/signin' });
          dispatch(updateUserInfo({ ...user }));
          if (!user.isApproved) navigate("/select-package");
          else navigate("/dashboard");
        }else toast.error(res.data.message);
      }).catch((e) => {
        toast.error("An error occured from server.");
      })
  }

  return (
    <div className="signin h-screen">
      <div className='py-5 px-32 w-full h-18 border-b'>
        <img src='/imgs/logo.png' alt="A" />
      </div>
      {!resetedPwd ?
        <div className='w-[370px] m-auto mt-60'>
          <h1 className='w-full text-center font-bold text-2xl text-[#000549]'>Set new password?</h1>
          <p className='my-2 text-center font-[500] text-[#303C4F]'>Enter your credentials to access your account</p>


          <div className='mt-10'>
            <div className='flex justify-between mt-6 mb-2'>
              <span className='text-[#303C4F] px-1 float-left font-semibold'>Password</span>
            </div>

            <div>
              <input 
                className='rounded-lg w-full focus:border-[#864FD9] font-[500] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' 
                placeholder='password' 
                type={`${showPassowrd ? 'password' : 'text'}`} 
                onChange={(e) => setPwd(e.target.value)}
              />
              <i className={`fa absolute -ml-6 mt-4 text-[#303C4F] cursor-pointer z-10 ${showPassowrd ? 'fa-eye' : 'fa-eye-slash'}`} onClick={() => setShowPassword(!showPassowrd)}></i>
            </div>

            <div className='flex justify-between mt-6 mb-2'>
              <span className='text-[#303C4F] text-sm px-1 float-left font-semibold'>Confirm new password</span>
            </div>

            <div>
              <input 
                className='rounded-lg w-full focus:border-[#864FD9] font-[500] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' 
                placeholder='password' 
                type={`${showConPassowrd ? 'password' : 'text'}`} 
                onChange={(e) => setConfirmPwd(e.target.value)}
              />
              <i className={`fa absolute -ml-6 mt-4 text-[#303C4F] cursor-pointer z-10 ${showConPassowrd ? 'fa-eye' : 'fa-eye-slash'}`} onClick={() => setShowConPassword(!showConPassowrd)}></i>
            </div>

            <button className='bg-[#6823D0] text-center px-4 py-3 text-white rounded-lg w-full mt-6 font-[500]' onClick={() => resetPassword()}>Reset Password</button>

          </div>
        </div>
        :
        <div>
          <div className='sm:w-[460px] w-[380px] m-auto mt-60'>
            <img src='/imgs/success-icon.png' className='mx-auto' alt="A" />
            <h1 className='w-full text-center font-bold text-2xl text-[#000549] mt-10'>Password Reset</h1>
            <p className='my-2 text-center font-[500] text-[#303C4F]'>Your password has been successfully reset. Click continue to login in your account</p>
            <div className='mt-10 rounded-lg mt-6 flex'>
              <button className='bg-[#6823D0] text-center px-4 py-3 text-white font-[500] rounded-lg w-full mx-1' onClick={() => { navigate('/signin') }}>Login</button>
            </div>
          </div>
        </div>
      }

    </div>
  );
}

export default ResetPassword;