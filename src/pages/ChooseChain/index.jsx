import { useNavigate } from "react-router-dom";

function ChooseChain() {
  const navigate = useNavigate();
  const isProduction = process.env.REACT_APP_NODE_ENV === "production";
  
  const nftType = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1];

  const selectChain = (name) => {
    navigate(`/create/${name}/${nftType}`)
  }

  return (
    <div className="select-package h-screen">
      <div className='py-5 px-32 w-full h-18 border-b'>
        <img src='/imgs/logo.png' alt="A" />
      </div>
      <div className='mt-24'>
        <div className='text-center'>
          <div className='w-[370px] m-auto'>
            <h1 className='w-full text-center font-bold text-2xl text-[#000549]'>Choose your Blockchain</h1>
            <p className='my-2 text-center text-[#6E7B91] font-[500]'>Select the blockchain where you'd like new items from this collection to be added by default.</p>
          </div>

          <div className='grid lg:grid-cols-4 md:grid-cols-2 md:grid-cols-1 lg:w-3/5 mx-auto mt-10 border-0 gap-3 text-center'>
            <div onClick={() => { selectChain(isProduction ? "ethereum" : "goerli") }} className='border sm:w-full mx-2 border-[#F0F2F4] h-fit rounded-lg my-1 py-6 pb-8 px-4 hover:border-[#6823d0] cursor-pointer text-center'>
              <img src='/imgs/eth-icon.png' className='mx-auto my-3' alt=''/>
              <h3 className='text-center font-bold text-[#000549]'>{isProduction ? "Ethereum" : "Goerli"}</h3>
            </div>

            <div onClick={() => { selectChain('solana') }} className='border sm:w-full mx-2 border-[#F0F2F4] h-fit rounded-lg my-1 py-6 pb-8 px-4 hover:border-[#6823d0] cursor-pointer'>
              <img src='/imgs/solana-icon.png' className='mx-auto my-3' alt=''/>
              <h3 className='text-center font-bold text-[#000549]'>Solana</h3>
            </div>

            <div onClick={() => { selectChain('tezos') }} className='border sm:w-full mx-2 border-[#F0F2F4] h-fit rounded-lg my-1 py-6 pb-8 px-4 hover:border-[#6823d0] cursor-pointer'>
              <img src='/imgs/tezos-icon.png' className='mx-auto my-3' alt=''/>
              <h3 className='text-center font-bold text-[#000549]'>Tezos</h3>
            </div>

            <div onClick={() => { selectChain('polygon') }} className='border sm:w-full mx-2 border-[#F0F2F4] h-fit rounded-lg my-1 py-6 pb-8 px-4 hover:border-[#6823d0] cursor-pointer'>
              <img src='/imgs/polygon-icon.png' className='mx-auto my-3' alt=''/>
              <h3 className='text-center font-bold text-[#000549]'>Polygon</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChooseChain;
