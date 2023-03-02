import '../../App.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

function SelectPackage() {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [cookies, setCookie] = useCookies(['user']);

  const Continue = () => {
    navigate('/payment-page', { state: { type: selectedPackage } })
  }

  return (
    <div className="select-package h-screen">
      <div className='py-5 px-32 w-full h-18 border-b'>
        <img src='imgs/logo.png' alt="A" />
      </div>
      <div className='mt-24'>
        <div className='text-center'>
          <div className='w-[370px] m-auto'>
            <h1 className='w-full text-center font-bold text-2xl text-[#000549]'>Select your Package</h1>
            <p className='my-2 text-sm text-center text-[#303C4F]'>Select the best type by matching your business need</p>
          </div>

          <div className='grid lg:grid-cols-4 md:grid-cols-2 md:grid-cols-1 lg:w-3/5 mx-auto mt-10 border-0 gap-3 text-center'>
            <div 
              className={`border sm:w-full mx-2 h-fit rounded-lg my-1 py-6 pb-8 px-4 hover:border-[#864FD9] cursor-pointer ${selectedPackage === 0 ? 'border-[#864FD9]' : 'border-[#F0F2F4]'}`} 
              onClick={() => setSelectedPackage(0)}>
              <h3 className='text-center font-bold text-[#000549]'>Single User</h3>
              <p className='text-[#6E7B91] text-center mt-4'>
                Limited to minting
                1 collection / month
                15% sales fees for the platform
                5% resale royalty</p>
              <h1 className='text-center text-2xl font-bold text-[#000549] mt-4'>$0</h1>
              <input type="radio" className='justify-self-center mt-4' onChange={()=>{}} checked={selectedPackage === 0}/>
            </div>

            <div className={`border sm:w-full mx-2 h-fit rounded-lg my-1 py-6 pb-8 px-4 hover:border-[#864FD9] cursor-pointer ${selectedPackage === 1 ? 'border-[#864FD9]' : 'border-[#F0F2F4]'}`} onClick={() => setSelectedPackage(1)}>
              <h3 className='text-center font-bold text-[#6823D0]'>Small Agency</h3>
              <p className='text-[#6E7B91] text-center mt-4'>3 Users
                Upto 5 collections/month
                5% sales fees for the platform
                5% resale royalty</p>
              <h1 className='text-center text-2xl font-bold text-[#000549] mt-4'>$300<span className='text-[#000549] text-xl'>/month</span></h1>
              <input type="radio" className='justify-self-center mt-4' onChange={()=>{}} checked={selectedPackage === 1}/>
            </div>

            <div className={`border sm:w-full mx-2 h-fit rounded-lg my-1 py-6 pb-8 px-4 hover:border-[#864FD9] cursor-pointer ${selectedPackage === 2 ? 'border-[#864FD9]' : 'border-[#F0F2F4]'}`} onClick={() => setSelectedPackage(2)}>
              <h3 className='text-center font-bold text-[#1CB23C]'>Enterprise</h3>
              <p className='text-[#6E7B91] text-center mt-4'>5 Users
                Upto 5 collections/month
                5% sales fees for the platform
                3% resale royalty</p>
              <h1 className='text-center text-2xl font-bold text-[#000549] mt-4'>$1000<span className='text-[#000549] text-xl'>/month</span></h1>
              <input type="radio" className='justify-self-center mt-4' onChange={()=>{}} checked={selectedPackage === 2}/>
            </div>

            <div className={`border sm:w-full mx-2 h-fit rounded-lg my-1 py-6 pb-8 px-4 hover:border-[#864FD9] cursor-pointer ${selectedPackage === 3 ? 'border-[#864FD9]' : 'border-[#F0F2F4]'}`} onClick={() => setSelectedPackage(3)}>
              <h3 className='text-center font-bold text-[#FF6B57]'>Custom</h3>
              <p className='text-[#6E7B91] text-center mt-4'>5 Users
                Upto 5 collections/month
                5% sales fees for the platform
                3% resale royalty</p>
              <button className='border border-[#6823D0] rounded-lg py-2 px-4 text-[#6823D0] text-center w-full mt-10'>Contact Sales</button>
            </div>
          </div>

          <button className='bg-[#6823D0] text-center px-4 py-3 text-white rounded-lg w-[370px] mt-6 mx-auto mb-4' onClick={() => Continue()}>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default SelectPackage;
