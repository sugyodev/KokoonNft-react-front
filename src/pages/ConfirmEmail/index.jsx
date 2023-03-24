import '../../App.css';
import { useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { updateUserInfo } from '../../store/actions/auth.actions';
import { useDispatch } from 'react-redux';

function ConfirmMail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(['user']);

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.search.slice(1));
    const tParam = fragment.get("t");
    if (tParam) onConfirmEmail(tParam);
  }, [window.location])

  const onConfirmEmail = useCallback(async (tParam) => {
    let paramData = {
      content: tParam
    }
    
    axios.post("/api/user/confirm_email", paramData)
      .then((res) => {
        if (res.data.status) {
          const user = res.data.user;
          dispatch(updateUserInfo({ ...user }));

          setCookie('Email', user.email, { path: '/signin' });
          setCookie('Password', user.pwd, { path: '/signin' });
          setCookie('LoginType', 1, { path: '/signin' });

          if (!user.isApproved) navigate("/select-package");
          else navigate("/dashboard");

        } else toast.error(res.data.message);
      }).catch((e) => {
        toast.error("An error occured from server.");
      })
  }, [])
  return (
    <></>
  );
}

export default ConfirmMail;
