import '../../App.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import axios from 'axios';
import moment from 'moment/moment';
import { useDispatch, useSelector } from 'react-redux';
import { setLocalStorageByUserinfo } from '../../utils';
import { updateUserInfo } from '../../store/actions/auth.actions';

const networks = {
  "amex": "American Express",
  "cartes_bancaires": "Cartes Bancaires",
  "unionpay": "China UnionPay",
  "diners": "Diners Club",
  "discover": "Discover",
  "jcb": "JCB",
  "mastercard": "Mastercard",
  "visa": "Visa",
};

function PaymentPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const packageId = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1];

  const [upackage, setUPackage] = useState(undefined);
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [clientSecrets, setClientSecrets] = useState([]);
  const [name, setName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [brand, setBrand] = useState("");

  const userInfo = useSelector((state) => state.auth.userInfo);
  const stripe = useStripe();
  const elements = useElements();
  let isLoading = false;

  useEffect(() => {
    let paramsData = {
      id: packageId
    }
    axios.get("/api/package", { params: paramsData })
      .then((res) => {
        if (res.data.status) {
          setUPackage(res.data.userPackage);
        }
      }).catch((e) => {
        console.log(e);
        toast.error("An error occured from server.")
      })
    if (isLoading) return;
    isLoading = true;
    axios.get("/api/create_payment_intent", { params: paramsData })
      .then((res) => {
        isLoading = false;
        if (res.data.status) {
          setClientSecrets(res.data.paymentIntents);
        } else toast.error(res.data.message);
      }).catch((e) => {
        console.log(e);
        toast.error("An error occured from server.")
      })
  }, [])


  /**
   * Stripe payment submit
   * @param {*} event 
   * @returns 
   */

  const payNow = async (event) => {
    if (processing) return;
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecrets[selectedPlan], {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: name
        },
      },
    })
    if (payload.error) {
      toast.error(payload.error.message);
      setProcessing(false);
      console.log(payload.error)
    } else {
      setSucceeded(true);
      setProcessing(false);
      setMetadata(payload.paymentIntent);
      console.log("Metadata : ", payload.paymentIntent);
    }
  }


  /**
   * Go to previous page
   */

  const back = () => {
    navigate(-1)
  }

  const onCardInfoChanged = (e) => {
    if (e.complete) {
      setBrand(networks[e.brand]);
    }
  }

  /**
   * Go to Dashboard page
   */
  const goToDashboard = () => {
    let paramsData = {
      id: userInfo.id,
      packId: upackage.id,
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
  }


  /**
   * 
   * @returns RenderSuccess Component
   */
  const renderSuccess = () => {
    return (
      <div className="payment-success h-screen">
        <div className='py-5 px-32 w-full h-18 border-b'>
          <img src='/imgs/logo.png' alt="A" />
        </div>
        <div className='sm:w-[460px] w-[380px] m-auto mt-20'>
          <img src='/imgs/success-icon.png' className='mx-auto' alt="A" />
          <h1 className='w-full text-center font-semibold text-2xl text-[#000549]'>Your payment success!</h1>
          <p className='my-2 text-sm text-center text-[#303C4F]'>Thank you, your payment has been proceed succesfully.</p>


          <div className='mt-10 border border-[#F0F2F4] rounded-lg p-6'>
            <div className='text-left'>
              <h1 className='w-full text-center font-semibold text-lg text-[#192528]'>Welcome Back</h1>
              <p className='my-2 text-sm text-center text-[#303C4F]'>Processed on {moment(metadata?.created * 1000).format('MMM DD, YYYY-h:mm a')}</p>
            </div>
            <div className='w-full h-[1px] border-b border-[#F0F2F4] mt-8'></div>

            <div>
              <div className='flex justify-between mt-10'>
                <span className='text-[#303C4F] text-lg'>Subtotal:</span>
                <span className='text-[#303C4F] text-lg'>${metadata?.amount / 100} USD</span>
              </div>
              <div className='flex justify-between mt-2'>
                <span className='text-[#303C4F] text-lg'>Tax(%):</span>
                <span className='text-[#303C4F] text-lg'>$0.00 USD</span>
              </div>
              <div className='flex justify-between mt-2'>
                <span className='text-[#303C4F] text-lg'>Billed Now:</span>
                <h1 className='text-xl font-semibold text-[#000549]'>${metadata?.amount / 100} USD</h1>
              </div>
            </div>
            <div className='w-full h-[1px] border-b border-[#F0F2F4] mt-8'></div>

            {/* <div className='mt-6'>
              <p className='text-[#8B95A7] text-sm text-left'>Payment Information</p>
              <div className='flex justify-between mt-1'>
                <div className='flex'>
                  <img src='/imgs/visa-icon.png' alt="A" />
                  <span className='text-base text-[#000549] font-semibold p-1'>{brand}</span>
                </div>
                <div className='text-[#303C4F]'>Credit **{}</div>
              </div>
            </div> */}
            <button className='bg-[#6823D0] text-center px-4 py-3 text-white rounded-lg w-full mt-6' onClick={() => goToDashboard()}>Go to your Dashboard</button>

          </div>
        </div>
      </div>
    );
  };


  /**
 * 
 * @returns RenderForm Component
 */
  const renderForm = () => {
    return (
      <div className="payment-page h-screen">
        <div className='py-5 px-32 w-full h-18 border-b'>
          <img src='/imgs/logo.png' alt="A" />
        </div>
        <div className='sm:mt-24 mt-10 w-full md:px-60 px-2 block sm:flex-1 justify-center'>
          <button className='bg-[#F0F2F4] px-4 py-3 text-[#303C4F] text-sm rounded-lg sm:float-left' onClick={back}><i className="fa fa-arrow-left mr-2" aria-hidden="true"></i>Back</button>
          <div className='mt-2 sm:mt-0'>
            <h1 className='w-full text-center font-semibold text-2xl text-[#000549]'>Complete your Payment</h1>
            <p className='my-2 font-[500] text-center text-[#303C4F]'>Select the best type by matching your business need</p>
          </div>
        </div>

        <div className='block md:flex justify-between lg:px-60 px-4'>
          <div className='border h-[283px] w-full md:w-80 p-6 border-[#F0F2F4] rounded-lg my-2'>
            <h3 className='text-center font-semibold text-[#6823D0]'>{upackage?.name}</h3>
            <h1 className='text-left text-2xl font-semibold text-[#000549] mt-4'>${upackage?.amount_monthly}</h1>
            <p className='text-[#000549] text-left text-sm'>{upackage?.invite_cnt} users/per month</p>
            <p className='text-[#6E7B91] text-left text-lg mt-4'><i className='fa fa-check-circle-o mr-2'></i>{upackage?.invite_cnt} Users</p>
            <p className='text-[#6E7B91] text-left text-lg mt-2'><i className='fa fa-check-circle-o mr-2'></i>Upto {upackage?.col_cnt} collections/month</p>
            <p className='text-[#6E7B91] text-left text-lg mt-2'><i className='fa fa-check-circle-o mr-2'></i>{upackage?.sale_fee}% sales fees for the platform</p>
            <p className='text-[#6E7B91] text-left text-lg mt-2'><i className='fa fa-check-circle-o mr-2'></i>{upackage?.resale_royalty}% resale royalty</p>
          </div>

          <div className='lg:w-8/12 w-full py-4 h-[680px] border border-[#F0F2F4] rounded-lg md:ml-3 my-2 px-2 sm:px-6'>
            <div className='flex'>
              <div className='block sm:flex justify-between bg-[#F1EAFB] rounded-lg px-3 sm:px-7 py-4 w-1/2 justify-center mx-2 h-32 cursor-pointer' onClick={() => setSelectedPlan(0)}>
                <input type="radio" className='float-left' onChange={() => { }} checked={selectedPlan === 0} />
                <div className='w-5/6'>
                  <h1 className='text-left text-xl font-semibold text-[#000549] mt-4'>Bill Monthly</h1>
                  <p className='text-[#000549] text-left text-sm'>${upackage?.amount_monthly}/month</p>
                </div>
              </div>
              <div className='block sm:flex justify-between bg-[#F1EAFB] rounded-lg px-3 sm:px-7 py-4 w-1/2 justify-center mx-2 h-32 cursor-pointer' onClick={() => setSelectedPlan(1)}>
                <input type="radio" className='float-left' onChange={() => { }} checked={selectedPlan === 1} />
                <div className='w-5/6'>
                  <div className='flex justify-between'>
                    <h1 className='text-left text-xl font-semibold text-[#000549] mt-4'>Bill Annually</h1>
                    <img src='/imgs/save-40-icon.png' className='h-3 w-12 mt-6 ml-2 hidden sm:block' />
                  </div>
                  <p className='text-[#000549] text-left text-sm'>${upackage?.amount_annually}/month</p>
                </div>
              </div>
            </div>
            <input
              className='text-[#8B95A7] text-sm border-b w-full mt-10 focus:outline-none px-4 py-2'
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {/* <p className='text-[#303C4F] text-sm my-2 px-1 mt-8'>Card number</p> */}

            <CardElement
              className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none'
              onChange={(e) => onCardInfoChanged(e)}
            />
            {/* <input className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='123 345 345' /> */}

            {/* <div className='flex grid grid-cols-3 mt-4'>
              <div className='mx-2'>
                <label htmlFor="small" className="text-[#303C4F] block mb-2 text-sm dark:text-white">Expire Date</label>
                <select id="small" defaultValue='default' className="block w-full focus:border-[#864FD9] focus:outline-none py-3 px-4  mb-6 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:shadow-md shadow-indigo-500/40  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value='default'>Month</option>
                  <option value="1">01</option>
                  <option value="2">02</option>
                  <option value="3">03</option>
                  <option value="4">04</option>
                  <option value="4">04</option>
                  <option value="5">05</option>
                  <option value="6">06</option>
                  <option value="7">07</option>
                  <option value="8">08</option>
                  <option value="9">09</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </div>
              <div className='mx-2'>
                <label htmlFor="small" className="text-[#303C4F] block mb-2 text-sm dark:text-white">Small select</label>
                <select id="small" defaultValue='default' className="block w-full  focus:border-[#864FD9] focus:outline-none py-3 px-4 mb-6 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:shadow-md shadow-indigo-500/40  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value='default'>Year</option>
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>
              <div className='mx-2'>
                <label htmlFor="small" className="text-[#303C4F] block mb-2 text-sm dark:text-white">CVC</label>
                <input className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-[10px] text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='123' />
              </div>
  
            </div> */}

            <div className='flex justify-between mt-10'>
              <span className='text-[#303C4F] text-lg'>Subtotal:</span>
              <span className='text-[#303C4F] text-lg'>$300.00 USD</span>
            </div>
            <div className='flex justify-between mt-2'>
              <span className='text-[#303C4F] text-lg'>Tax(%):</span>
              <span className='text-[#303C4F] text-lg'>$0.00 USD</span>
            </div>
            <div className='flex justify-between mt-2'>
              <span className='text-[#303C4F] text-lg'>Billed Now:</span>
              <h1 className='text-xl font-semibold text-[#000549]'>$300.00 USD</h1>
            </div>
            {/* {Pyament Element is must require secret key} */}
            {/* <PaymentElement />   */}
            <button
              className='bg-[#6823D0] text-center px-4 py-3 text-white rounded-lg w-32 float-right mt-6'
              disabled={!stripe || processing || !clientSecrets}
              onClick={() => payNow()}>
              {processing ? "Processing..." : "Pay Now"}
            </button>
          </div>
          <div></div>
        </div>
      </div>
    );
  };

  return (
    <>
      {succeeded ? renderSuccess() : renderForm()}
    </>
  );
}

export default PaymentPage;
