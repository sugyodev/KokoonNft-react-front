import '../../App.css';
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useRef, useEffect } from 'react';
import {
  LoginSocialGoogle,
  LoginSocialFacebook,
} from "reactjs-social-login";
import axios from 'axios';
import { toast } from 'react-toastify';
import formValidation from '../../utils/formValidation';
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfo } from '../../store/actions/auth.actions';
import { setLocalStorageByUserinfo, removeLocalstrage } from '../../utils'

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassowrd, setShowPassword] = useState(true)
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formValid, setFormValid] = useState({ 'email': false, 'password': false })
  const [isLoginSuccess, setIsLoginSuccess] = useState(true);

  const userInfo = useSelector((state) => state.auth.userInfo);

  const goSignUp = () => {
    navigate('/signup')
  }

  const handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case 'email':
        setEmail(value)
        setFormValid({ ...formValid, email: formValidation('email', value) })
        break;
      case 'password':
        setPassword(value)
        setFormValid({ ...formValid, password: formValidation('password', value) })
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (localStorage.getItem('loginStatus') === 'true' && (Number.parseInt(localStorage.getItem('expiration')) > new Date().getTime())) {
      console.log(userInfo, "userInfo")
      navigate('/dashboard');
    } else {
      removeLocalstrage()
    }
  });


  const signIn = () => {
    if (email.length === 0 || password.length === 0) {
      toast.warn("Email and Password is required.");
    } else {
      if (formValid.email && formValid.password) {
        let paramData = {
          email: email,
          pwd: password,
          loginType: 1
        }
        axios.post("/api/user/signin", paramData)
          .then((res) => {
            if (res.data.status) {
              setLocalStorageByUserinfo(paramData)
              const user = res.data.user;
              setIsLoginSuccess(true)
              // if (!user.isApproved) navigate("/select-package");
              // if (!user.isConfirmed) navigate("/sendemail");
              // else {
                toast.success("Login success.");
                navigate('/dashboard')
                dispatch(updateUserInfo({ ...user }));
              // }
            } else {
              setIsLoginSuccess(false)
              toast.error(res.data.message);
            }
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
      }
    }
  }

  const onLoginStart = useCallback(() => {
    console.log("login start");
    // navigate('/signin')
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
    let paramData = {
      email: data.email,
      username: data.name,
      avatar: data.picture,
      loginType: 2
    }
    axios.post("/api/user/signup", paramData)
      .then((res) => {
        if (res.data.status) {
          const user = res.data.user;
          toast.success("Login success.");
          if (!user.isApproved) navigate("/select-package");
          else {
            navigate("/dashboard");
            dispatch(updateUserInfo({ ...user }));
          }
        } else {
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
      const { id, username, discriminator, email, avatar } = response.data;
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
        username: response.data.username,
        avatar: avatarLink,
        loginType: 4
      }
      axios.post("/api/user/signup", paramData)
        .then((res) => {
          const user = res.data.user;
          if (!user.isApproved) navigate("/select-package");
          else navigate("/dashboard");
        }).catch((e) => {
          toast.error("An error occured from server.");
          console.log(e);
        })
    } catch {
      console.log("error getting user");
    }
  }, []);

  return (
    <div className="signin h-screen">
      <div className='py-5 px-32 w-full h-18 border-b'>
        <img src='imgs/logo.png' alt="A" />
      </div>
      <div className='w-[370px] m-auto mt-32'>
        <h1 className='w-full text-center font-bold text-2xl text-[#000549]'>Welcome Back</h1>
        <p className='my-2 text-center text-[#303C4F]'>Enter your credentials to access your account</p>

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
          <p className='text-[#303C4F] my-2 px-1 font-bold'>Email address</p>
          <input className={`rounded-lg w-full focus:border-[#864FD9] border px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none ${isLoginSuccess ? 'border-[#D3D8DE]' : 'border-[#FF6B57]'}`} onChange={handleUserInput} name='email' value={email} placeholder='rafiqur51@company.com |' />
          {!isLoginSuccess &&
            <p className='text-[#FF6B57] my-2 px-1 font-bold'>This email isn’t registered or not found.</p>
          }
          <div className='flex justify-between mt-6 mb-2'>
            <span className='text-[#303C4F] px-1 float-left font-bold'>Password</span>
            <span className='text-[#864FD9] cursor-pointer px-1 float-right font-bold' onClick={() => navigate('/forgotpwd')}>Forgot Password?</span>
          </div>

          <div>
            <input className={`rounded-lg w-full focus:border-[#864FD9] border px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none ${isLoginSuccess ? 'border-[#D3D8DE]' : 'border-[#FF6B57]'}`} onChange={handleUserInput} name='password' value={password} placeholder='password' type={`${showPassowrd ? 'password' : 'text'}`} />
            <i className={`fa absolute -ml-6 mt-4 text-[#303C4F] cursor-pointer z-10 ${showPassowrd ? 'fa-eye' : 'fa-eye-slash'}`} onClick={() => setShowPassword(!showPassowrd)}></i>
          </div>
          {!isLoginSuccess &&
            <p className='text-[#FF6B57] my-2 px-1 font-bold'>Incorrect password</p>
          }

          <button
            className='bg-[#6823D0] text-center px-4 py-3 text-white rounded-lg w-full mt-6'
            onClick={() => signIn()}
          >Login</button>

          <div className='text-center justify-center mt-2'>
            <span className='text-[#6E7B91] font-bold'>Need an account?</span>
            <span className='text-[#864FD9] ml-2 cursor-pointer font-bold' onClick={() => goSignUp()}>Create account</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SignIn;
