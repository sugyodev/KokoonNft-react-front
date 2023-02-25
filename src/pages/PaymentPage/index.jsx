import '../../App.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

function PaymentPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const stripe = useStripe();
  const elements = useElements();

  const payNow = async (event) => {
    navigate('/payment-success')
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "https://localhost:3000/payment-success",
      },
    });


    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  }

  const back = () => {
    navigate(-1)
  }

  return (
    <div className="payment-page">
      <div className='py-5 px-32 w-full h-18 border-b'>
        <img src='imgs/logo.png' alt="A" />
      </div>
      <div className='sm:mt-24 mt-10 w-full md:px-60 px-2 block sm:flex-1 justify-center'>
        <button className='bg-[#F0F2F4] px-4 py-3 text-[#303C4F] text-sm rounded-lg sm:float-left' onClick={back}><i className="fa fa-arrow-left mr-2" aria-hidden="true"></i>Back</button>
        <div className='mt-2 sm:mt-0'>
          <h1 className='w-full text-center font-bold text-2xl text-[#000549]'>Complete your Payment</h1>
          <p className='my-2 text-sm text-center text-[#303C4F]'>Select the best type by matching your business need</p>
        </div>
      </div>

      <div className='block md:flex justify-between lg:px-60 px-4'>
        <div className='border h-[283px] w-full md:w-80 p-6 border-[#F0F2F4] rounded-lg my-2'>
          <h3 className='text-center font-bold text-[#6823D0]'>Small Agency</h3>
          <h1 className='text-left text-2xl font-bold text-[#000549] mt-4'>$300</h1>
          <p className='text-[#000549] text-left text-sm'>3 users/per month</p>
          <p className='text-[#6E7B91] text-left text-lg mt-4'><i className='fa fa-check-circle-o mr-2'></i>3 Users</p>
          <p className='text-[#6E7B91] text-left text-lg mt-2'><i className='fa fa-check-circle-o mr-2'></i>Upto 5 collections/month</p>
          <p className='text-[#6E7B91] text-left text-lg mt-2'><i className='fa fa-check-circle-o mr-2'></i>5% sales fees for the platform</p>
          <p className='text-[#6E7B91] text-left text-lg mt-2'><i className='fa fa-check-circle-o mr-2'></i>5% resale royalty</p>
        </div>

        <div className='lg:w-8/12 w-full py-4 h-[680px] border border-[#F0F2F4] rounded-lg md:ml-3 my-2 px-2 sm:px-6'>
          <div className='flex'>
            <div className='block sm:flex justify-between bg-[#F1EAFB] rounded-lg px-3 sm:px-7 py-4 w-1/2 justify-center mx-2 h-32 cursor-pointer' onClick={() => setSelectedPlan('monthly')}>
              <input type="radio" className='float-left' onChange={() => { }} checked={selectedPlan === 'monthly'} />
              <div className='w-5/6'>
                <h1 className='text-left text-xl font-bold text-[#000549] mt-4'>Bill Monthly</h1>
                <p className='text-[#000549] text-left text-sm'>$300/month</p>
              </div>
            </div>
            <div className='block sm:flex justify-between bg-[#F1EAFB] rounded-lg px-3 sm:px-7 py-4 w-1/2 justify-center mx-2 h-32 cursor-pointer' onClick={() => setSelectedPlan('yearly')}>
              <input type="radio" className='float-left' onChange={() => { }} checked={selectedPlan === 'yearly'} />
              <div className='w-5/6'>
                <div className='flex justify-between'>
                  <h1 className='text-left text-xl font-bold text-[#000549] mt-4'>Bill Annually</h1>
                  <img src='imgs/save-40-icon.png' className='h-3 w-12 mt-6 ml-2 hidden sm:block' />
                </div>
                <p className='text-[#000549] text-left text-sm'>$3,200/month</p>
              </div>
            </div>
          </div>
          <input className='text-[#8B95A7] text-sm border-b w-full mt-10 focus:outline-none px-4 py-2' placeholder='Payment Information' />
          <p className='text-[#303C4F] text-sm my-2 px-1 mt-8'>Card number</p>
          <input className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='123 345 345' />

          <div className='flex grid grid-cols-3 mt-4'>
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

          </div>

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
            <h1 className='text-xl font-bold text-[#000549]'>$300.00 USD</h1>
          </div>
          <form onSubmit={payNow}>
            {/* {Pyament Element is must require secret key} */}
            {/* <PaymentElement />   */}
            <button className='bg-[#6823D0] text-center px-4 py-3 text-white rounded-lg w-32 float-right mt-6' disabled={!stripe}>Pay now</button>
          </form>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default PaymentPage;
