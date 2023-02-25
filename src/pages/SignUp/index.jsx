import '../../App.css';
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useRef } from 'react';
import {
  LoginSocialGoogle,
  LoginSocialFacebook,
} from "reactjs-social-login";

// import Oauth from "discord-oauth2";

function SignUp() {
  // const oauth = new DiscordOauth2();
  const navigate = useNavigate();
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState();

  const goSignIn = () => {
    navigate('/signin')
  }

  const SelectPackage = () => {
    navigate('/select-package')
  }
  const [showPassowrd, setShowPassword] = useState(false)
  
  const onLoginStart = useCallback(() => {
    console.log("login start");
    // window.open('https://kocoon.app')
  }, []);

  const onLogoutFailure = useCallback(() => {
    console.log("logout fail");
  }, []);

  const onLogoutSuccess = useCallback(() => {
    setProfile(null);
    setProvider("");
    console.log("logout success");
  }, []);

  const loginWithDiscrod = () => {
    // oauth.tokenRequest({
    //   clientId: "332269999912132097",
    //   clientSecret: "937it3ow87i4ery69876wqire",

    //   code: "query code",
    //   scope: "identify guilds",
    //   grantType: "authorization_code",
    //   redirectUri: "http://localhost/callback",
    // }).then((res) => { console.log(res); })
    window.open(
      `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=https://kocoon.app&response_type=token&scope=identify`,
      "_parent"
    )
  }
  return (
    <div className="signup h-screen">
      <div className='py-5 px-32 w-full h-18 border-b'>
        <img src='imgs/logo.png' alt="A" />
      </div>
      <div className='w-[370px] m-auto mt-20'>
        <h1 className='w-full text-center font-bold text-2xl text-[#000549]'>Join Kocoon</h1>
        <p className='my-2 text-sm text-center text-[#303C4F]'>Get started with Koccon by creating your profile</p>
        <div className='flex my-6'>
          <LoginSocialGoogle
            client_id={process.env.GOOGLE_CLIENT_ID || "35698575794-dgjvautd76mbps09265irfd61lntomoe.apps.googleusercontent.com"}
            onLogoutFailure={onLogoutFailure}
            onLoginStart={onLoginStart}
            onLogoutSuccess={onLogoutSuccess}
            onResolve={({ provider, data }) => {
              console.log("gdata", data);
              setProvider(provider);
              setProfile(data);
            }}
            onReject={(err) => {
              console.log(err);
            }}
          >
            <button className='bg-[#F6F6F6] rounded-lg h-12 text-center px-4 py-3 w-28 mx-1'>
              <img src='imgs/google-icon.png' className='mx-auto' width={20} alt="A" />
            </button>
          </LoginSocialGoogle>

          <LoginSocialFacebook
            appId={process.env.FACEBOOK_APP_ID || ""}
            onLoginStart={onLoginStart}
            onLogoutSuccess={onLogoutSuccess}
            onResolve={({ provider, data }) => {
              setProvider(provider);
              console.log("data", data);
              setProfile(data);
            }}
            onReject={(err) => {
              console.log(err);
            }}
          >
            <button className='bg-[#F6F6F6] rounded-lg h-12 text-center px-4 py-3 w-28 mx-1'>
              <img src='imgs/facebook-icon.png' className='mx-auto' width={20} alt="A" />
            </button>
          </LoginSocialFacebook>

          <button className='bg-[#F6F6F6] rounded-lg h-12 text-center px-4 py-3 w-28 mx-1' onClick={loginWithDiscrod}>
            <img src='imgs/discord-icon.png' className='mx-auto' width={20} alt="A" />
          </button>
        </div>

        <div className='divided w-full flex mt-10'>
          <div className='w-40 border border-b-0 h-[1px] mt-[10px]'></div>
          <span className='mx-2 text-sm text-[#303C4F]'>or</span>
          <div className='w-40 border border-b-0 h-[1px] mt-[10px]'></div>
        </div>
        <div className='mt-10'>
          <div className='flex'>
            <div className='w-1/2 mx-1'>
              <p className='text-[#303C4F] text-sm my-2 px-1 font-semibold'>First Name</p>
              <input className='rounded-lg w-full focus:border-[#864FD9] border-[#D3D8DE] border px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='rafiqur' />
            </div>
            <div className='w-1/2 mx-1'>
              <p className='text-[#303C4F] text-sm my-2 px-1 font-semibold'>Last Name</p>
              <input className='rounded-lg w-full focus:border-[#864FD9] border-[#D3D8DE] border px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='rafiqur' />
            </div>
          </div>

          <p className='text-[#303C4F] text-sm my-2 px-1 font-semibold'>Email Address</p>
          <input className='rounded-lg w-full focus:border-[#864FD9] border-[#D3D8DE] border px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='rafiqur51@company.com' />

          <span className='text-[#303C4F] text-sm px-1 float-left mt-3 font-semibold'>Password</span>
          <div>
            <input className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='password' type={`${showPassowrd ? 'password' : 'text'}`} />
            <i className={`fa absolute -ml-6 mt-4 text-[#303C4F] cursor-pointer z-10 ${showPassowrd ? 'fa-eye' : 'fa-eye-slash'}`} onClick={() => setShowPassword(!showPassowrd)}></i>
          </div>
          <div className='mt-6 text-sm text-[#303C4F]'>
            <input type="checkbox" className='mr-2' /><span>I agree to the <span className='cursor-pointer text-[#ff6b57]'>Terms & Priavcy</span></span>
          </div>
          <button className='bg-[#6823D0] text-center px-4 py-3 text-white rounded-lg w-full mt-6' onClick={SelectPackage}>Create</button>
        </div>

        <div className='text-center justify-center mt-2'>
          <span className='text-[#6E7B91] text-sm font-semibold'>Already have an account?</span>
          <span className='text-sm text-[#864FD9] ml-2 cursor-pointer' onClick={() => goSignIn()}>Log in</span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
