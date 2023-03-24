import '../../App.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../../store/actions/auth.actions';
import { setLocalStorageByUserinfo } from '../../utils';

function SelectPackage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [upackages, setUPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(0);

  const userInfo = useSelector((state) => state.auth.userInfo);

  const Continue = (_package) => {
    if (_package.id === 0) {
      let paramsData = {
        id: userInfo.id,
        packId: _package.id
      }
      axios.post("/api/user/update", paramsData)
        .then((res) => {
          if (res.data.status) {
            const user = res.data.user;
            setLocalStorageByUserinfo(user.loginType > 1 ? {
              loginType: user.loginType,
              id: res.data.user.id
            } : {
              email: user.email,
              pwd: user.password,
              loginType: 1,
              id: res.data.user.id
            })
            dispatch(updateUserInfo({ ...user }));
            navigate("/dashboard")
          } else {
            toast.error(res.data.message);
          }
        }).catch((e) => {
          toast.error("An error occured from server.")
          console.log(e);
        })
    } else {
      navigate(`/payment-page/${_package.id}`);
    }
    //navigate('/payment-page');
  }

  useEffect(() => {
    axios.get("/api/user/type_config")
      .then((res) => {
        if (res.data.status) {
          console.log(res.data.userPackages);
          setUPackages(res.data.userPackages);
        }
      }).catch((e) => {
        console.log(e);
        toast.error("An error occured from server.")
      })
  }, []);

  const onContactSale = () => {
    console.log("Contact Sale");
  }

  return (
    <div className="select-package h-screen">
      <div className='py-5 px-32 w-full h-18 border-b'>
        <img src='/imgs/logo.png' alt="A" />
      </div>
      <div className='mt-24'>
        <div className='text-center'>
          <div className='w-[370px] m-auto'>
            <h1 className='w-full text-center font-bold text-2xl text-[#000549]'>Select your Package</h1>
            <p className='my-2 text-center font-[500] text-[#303C4F]'>Select the best type by matching your business need</p>
          </div>

          <div className='grid lg:grid-cols-4 md:grid-cols-2 md:grid-cols-1 lg:w-3/5 mx-auto mt-10 border-0 gap-3 text-center'>
            {
              upackages.map((upackage, key) => {
                return <div
                  className={`border sm:w-full mx-2 h-fit rounded-lg my-1 py-6 pb-8 px-4 hover:border-[#864FD9] cursor-pointer ${selectedPackage === upackage.id ? 'border-[#864FD9]' : 'border-[#F0F2F4]'}`}
                  onClick={() => setSelectedPackage(upackage.id)}>
                  <h3 className={`text-left font-semibold text-black text-lg text-[#6823D0]`}>{upackage.name}</h3>
                  <h1 className='text-left text-2xl font-semibold text-[#000549] mt-4'>{upackage.amount_monthly === 0 ? "Free" : ("$" + upackage.amount_monthly)}</h1>
                  <p className='text-[#000549] text-left font-semibold'>{upackage.invite_cnt === 1 ? "1 user" : (upackage.invite_cnt + " users")}/per month</p>
                  <p className='text-[#6E7B91] text-left text-lg mt-4'><i className='fa fa-check-circle-o mr-2'></i>{upackage.invite_cnt === 1 ? "1 user" : (upackage.invite_cnt + " users")}</p>
                  <p className='text-[#6E7B91] text-left text-lg mt-2'><i className='fa fa-check-circle-o mr-2'></i>{upackage.col_cnt === 1 ? "1 collection" : ("Upto " + upackage.col_cnt + " collections")} / month</p>
                  <p className='text-[#6E7B91] text-left text-lg mt-2'><i className='fa fa-check-circle-o mr-2'></i>{upackage.sale_fee}% sales fees for the platform</p>
                  <p className='text-[#6E7B91] text-left text-lg mt-2'><i className='fa fa-check-circle-o mr-2'></i>{upackage.resale_royalty}% resale royalty</p>
                  <button className='hover:bg-[#6823D0] text-[#303C4F] bg-white hover:border-[6823D0] border border-[#D3D8DE] text-center px-4 py-3 hover:text-white rounded-lg w-full mt-6 mx-auto mb-4 font-[500]' onClick={() => Continue(upackage)}>Continue</button>
                </div>
              })
            }

            <div
              className={`border sm:w-full mx-2 h-fit rounded-lg my-1 py-6 pb-8 px-4 hover:border-[#864FD9] cursor-pointer ${selectedPackage === 3 ? 'border-[#864FD9]' : 'border-[#F0F2F4]'}`}
              onClick={() => setSelectedPackage(3)}>
              <h3 className='text-left font-semibold text-[#FF6B57] text-lg'>Custom</h3>
              <h1 className='text-left text-3xl font-semibold text-[#000549] mt-4'>--</h1>
              <p className='text-[#000549] text-left font-semibold'>For large organization</p>
              <p className='text-[#6E7B91] text-left text-lg mt-4'><i className='fa fa-check-circle-o mr-2'></i>Unlimited Users</p>
              <p className='text-[#6E7B91] text-left text-lg mt-2'><i className='fa fa-check-circle-o mr-2'></i>15 collections/month</p>
              <p className='text-[#6E7B91] text-left text-lg mt-2'><i className='fa fa-check-circle-o mr-2'></i>5% sales fees for the platform</p>
              <p className='text-[#6E7B91] text-left text-lg mt-2'><i className='fa fa-check-circle-o mr-2'></i>5% resale royalty</p>
              <button className='hover:bg-[#6823D0] text-[#303C4F] bg-white hover:border-[6823D0] border border-[#D3D8DE] text-center px-4 py-3 hover:text-white rounded-lg w-full mt-6 mx-auto mb-4 font-[500]' onClick={() => onContactSale()}>Contact Sales</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectPackage;
