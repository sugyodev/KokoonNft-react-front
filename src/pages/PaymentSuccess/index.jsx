import '../../App.css';
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/dashboard')
  }

  return (
    <div className="payment-success h-screen">
      <div className='py-5 px-32 w-full h-18 border-b'>
        <img src='imgs/logo.png' alt="A" />
      </div>
      <div className='sm:w-[460px] w-[380px] m-auto mt-20'>
        <img src='imgs/success-icon.png' className='mx-auto' alt="A" />
        <h1 className='w-full text-center font-bold text-2xl text-[#000549]'>Your payment success!</h1>
        <p className='my-2 text-sm text-center text-[#303C4F]'>Thank you, your payment has been proceed succesfully.</p>


        <div className='mt-10 border border-[#F0F2F4] rounded-lg p-6'>
          <div className='text-left'>
            <h1 className='w-full text-center font-bold text-lg text-[#192528]'>Welcome Back</h1>
            <p className='my-2 text-sm text-center text-[#303C4F]'>Processed on Oct 17, 2021 - 09:48 AM</p>
          </div>
          <div className='w-full h-[1px] border-b border-[#F0F2F4] mt-8'></div>

          <div>
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
          </div>
          <div className='w-full h-[1px] border-b border-[#F0F2F4] mt-8'></div>

          <div className='mt-6'>
            <p className='text-[#8B95A7] text-sm text-left'>Payment Information</p>
            <div className='flex justify-between mt-1'>
              <div className='flex'>
                <img src='imgs/visa-icon.png' alt="A" />
                <span className='text-base text-[#000549] font-bold p-1'>Visa</span>
              </div>
              <div className='text-[#303C4F]'>Credit **6482</div>
            </div>
          </div>
          <button className='bg-[#6823D0] text-center px-4 py-3 text-white rounded-lg w-full mt-6' onClick={() => goToDashboard()}>Go to your Dashboard</button>

        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
