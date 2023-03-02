import '../../App.css';
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useRef, useEffect } from 'react';
import {
  LoginSocialGoogle,
  LoginSocialFacebook,
} from "reactjs-social-login";
import axios from 'axios';
import { useCookies } from 'react-cookie';
import formValidation from '../../utils/formValidation';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { setSendEmailStatus, updateUserInfo } from '../../store/actions/auth.actions';

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState();
  const [formData, setFormData] = useState({ email: '', password: '', username: '', terms: false })
  const [formValid, setFormValid] = useState({ 'email': false, 'password': false })

  const [isAgreed, setAgreed] = useState(false);
  const [cookies, setCookie] = useCookies(['user']);

  const goSignIn = () => {
    navigate('/signin')
  }

  const handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case 'email':
        setFormData({ ...formData, email: value })
        setFormValid({ ...formValid, email: formValidation('email', value) })
        break;
      case 'password':
        setFormData({ ...formData, password: value })
        setFormValid({ ...formValid, password: formValidation('password', value) })
        break;
      case 'username':
        setFormData({ ...formData, username: value })
        break;
      case 'terms':
        setFormData({ ...formData, terms: e.target.checked })
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (!formData.email && formData.email !== "") {
    }
  }, [formData.email]);

  const signUp = () => {

    if (formData.email === '' || formData.password === '' || formData.username === '') {
      toast.warn("You must fill out all the fields.");
    } else {
      if (formValid.email && formValid.password && formData.terms) {
        let paramData = {
          username: formData.username,
          email: formData.email,
          pwd: formData.password,
          loginType: 1
        }
        axios.post("/api/user/signup", paramData)
          .then((res) => {
            if (res.data.status) {
              toast.success("Verify your email.");
              setCookie('Email', formData.email, { path: '/signin' });
              setCookie('Password', formData.password, { path: '/signin' });
              setCookie('LoginType', 1, { path: '/signin' });
              //go to page for email sent
              dispatch(updateUserInfo({ ...res.data.user }));
              dispatch(setSendEmailStatus('signup'));
              navigate("/sendemail");
            }else toast.error(res.data.message);
          }).catch((e) => {
            console.log(e);
            toast.error("An error occured from server.");
          })
      } else {
        if (!formValid.email) {
          toast.warn("Email is not valid.");
        }
        if (!formValid.password) {
          toast.warn("Password length should be more than 6.");
        }
        if (!formData.terms) {
          toast.warn("You must agreed with terms & contidions for signup.");
        }
      }
    }
  }
  const [showPassowrd, setShowPassword] = useState(true)

  const onLoginStart = useCallback(() => {
    console.log("login start");
    // window.open('https://kocoon.app')
  }, []);

  const onLoginSuccess = useCallback((provider, data) => {
    setProvider(provider);
    //   {
    //     "access_token": "ya29.a0AVvZVsoxYdvA7uOhMFg0nacbT8pO7YwkA1cm-O1120XvN3DL6ij33z6-98KR8mL4R6ln3rKegqnr1ylRerbB6b089V_8FiIxC7mEiqTz7Du3KVc7Xim0Krv1y5vFPpGalXDWc3YanKuZnKT2gGfJJplaIDxKaCgYKAf4SARISFQGbdwaINd2eLRfKwrtoDyQXUIdYKg0163",
    //     "token_type": "Bearer",
    //     "expires_in": 3599,
    //     "scope": "email profile https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile",
    //     "authuser": "0",
    //     "prompt": "consent",
    //     "sub": "102399768610035655494",
    //     "name": "God Crypto",
    //     "given_name": "God",
    //     "family_name": "Crypto",
    //     "picture": "https://lh3.googleusercontent.com/a/AGNmyxYJdEJbwfjjsLMo3gv19PvCcApyGq1MG5q9bxMm=s96-c",
    //     "email": "godcrypto0616@gmail.com",
    //     "email_verified": true,
    //     "locale": "en"
    // }
    const { name, picture } = data;
    let paramData = {
      email: data.email,
      username: name,
      avatar: picture,
      loginType: 2
    }
    axios.post("/api/user/signup", paramData)
      .then((res) => {
        if (res.data.status){
          setCookie('Email', data.email, { path: '/signin' });
          setCookie('LoginType', 2, { path: '/signin' });
          const user = res.data.user;
          if (!user.isApproved) navigate("/select-package");
          else {
            dispatch(updateUserInfo({ ...user }));
            navigate("/dashboard")
          }
        }else{
          toast.error(res.data.message);
        }
      }).catch((e) => {
        toast.error("An error occured from server.");
        console.log(e);
      })
  }, [])

  const onLogoutFailure = useCallback(() => {
    console.log("logout fail");
  }, []);

  const onLogoutSuccess = useCallback(() => {
    setProfile(null);
    setProvider("");
    console.log("logout success");
  }, []);

  const getRedirectURI = () => {
    return window.location.protocol + "//" + window.location.host + "/signin"
  }

  const loginWithDiscrod = () => {
    window.open(
      `https://discord.com/api/oauth2/authorize?` +
      `client_id=${process.env.REACT_APP_DISCORD_CLIENT_ID}` +
      `&redirect_uri=${getRedirectURI()}` +
      `&response_type=token` +
      `&scope=identify email`,
      "_parent"
    )
  }

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType] = [
      fragment.get("access_token"),
      fragment.get("token_type")
    ];
    if (accessToken && tokenType) {
      getUserDetails(accessToken, tokenType);
    }
  }, [window.location])

  const getUserDetails = useCallback(async (accessToken, tokenType) => {
    try {
      const response = await axios.get("https://discord.com/api/users/@me", {
        headers: {
          authorization: `${tokenType} ${accessToken}`
        }
      });
      const { id, username, discriminator, avatar } = response.data;
      const avatarLink = `https://cdn.discordapp.com/avatars/${id}/${avatar}`;
      //   {
      //     "id": "898186345393061928",
      //     "username": "God Crypto",
      //     "display_name": null,
      //     "avatar": "75507b1975c1fb5631bb1e78c84a654a",
      //     "avatar_decoration": null,
      //     "discriminator": "9258",
      //     "public_flags": 0,
      //     "flags": 0,
      //     "banner": null,
      //     "banner_color": null,
      //     "accent_color": null,
      //     "locale": "en-US",
      //     "mfa_enabled": false,
      //     "premium_type": 0,
      //     "email": "victorypiao@gmail.com",
      //     "verified": true
      // }
      let paramData = {
        email: response.data.email,
        username: username,
        avatar: avatarLink,
        loginType: 4
      }
      axios.post("/api/user/signup", paramData)
        .then((res) => {
          if (res.data.status){
            setCookie('Email', response.data.email, { path: '/signin' });
            setCookie('LoginType', 4, { path: '/signin' });
            const user = res.data.user;
            if (!user.isApproved) navigate("/select-package");
            else navigate("/dashboard");
          }else{
            toast.error(res.data.message);
          }
          
        }).catch((e) => {
          toast.error("An error occured from server.");
          console.log(e);
        })
    } catch {
      console.log("error getting user");
    }
  }, []);

  return (
    <div className="signup h-screen">
      <div className='py-5 px-32 w-full h-18 border-b'>
        <img src='imgs/logo.png' alt="A" />
      </div>
      <div className='w-[370px] m-auto mt-20'>
        <h1 className='w-full text-center font-bold text-2xl text-[#000549]'>Join Kocoon</h1>
        <p className='my-2 text-center text-[#303C4F]'>Get started with Koccon by creating your profile</p>
        <div className='flex my-6'>
          <LoginSocialGoogle
            client_id={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            onLogoutFailure={onLogoutFailure}
            onLoginStart={onLoginStart}
            onLogoutSuccess={onLogoutSuccess}
            onResolve={({ provider, data }) => {
              onLoginSuccess(provider, data);
            }}
            onReject={(err) => {
              console.log(err);
            }}
            redirect_uri={getRedirectURI()}
            scope={"https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"}
          >
            <button className='bg-[#F6F6F6] rounded-lg h-12 text-center px-4 py-3 w-28 mx-1'>
              <img src='imgs/google-icon.png' className='mx-auto' width={20} alt="A" />
            </button>
          </LoginSocialGoogle>

          <LoginSocialFacebook
            appId={process.env.REACT_APP_FACEBOOK_APP_ID || ""}
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
          <span className='mx-2 text-[#303C4F]'>or</span>
          <div className='w-40 border border-b-0 h-[1px] mt-[10px]'></div>
        </div>
        <div className='mt-10'>

          <p className='text-[#303C4F] my-2 px-1 font-bold'>User Name</p>
          <input
            className='rounded-lg w-full focus:border-[#864FD9] border-[#D3D8DE] border px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none'
            placeholder='rafiqur'
            type='text'
            name='username'
            onChange={handleUserInput}
            value={formData.username}
          />

          <p className='text-[#303C4F]  my-2 px-1 font-bold'>Email Address</p>
          <input className='rounded-lg w-full focus:border-[#864FD9] border-[#D3D8DE] border px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' onChange={handleUserInput} name='email' value={formData.email} placeholder='rafiqur51@company.com' />

          <span className='text-[#303C4F]  px-1 float-left mt-3 font-bold'>Password</span>
          <div>
            <input className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' onChange={handleUserInput} name='password' value={formData.password} placeholder='password' type={`${showPassowrd ? 'password' : 'text'}`} />
            <i className={`fa absolute -ml-6 mt-4 text-[#303C4F] cursor-pointer z-10 ${showPassowrd ? 'fa-eye' : 'fa-eye-slash'}`} onClick={() => setShowPassword(!showPassowrd)}></i>
          </div>
          <div className='mt-6  text-[#303C4F]'>
            <input type="checkbox" name='terms' className='mr-2' onChange={handleUserInput} /><span>I agree to the <span className='cursor-pointer text-[#ff6b57]'>Terms & Priavcy</span></span>
          </div>
          <button className='bg-[#6823D0] text-center px-4 py-3 text-white rounded-lg w-full mt-6' onClick={signUp}>Create</button>
        </div>

        <div className='text-center justify-center mt-2'>
          <span className='text-[#6E7B91] font-bold'>Already have an account?</span>
          <span className='text-[#864FD9] ml-2 cursor-pointer font-bold' onClick={() => goSignIn()}>Log in</span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
