import '../../App.css';
import { useDispatch, useSelector } from "react-redux";
import { settingUpNftCreateModal, setCollectionCreateModal, setShareNftCreatedModal } from '../../store/actions/auth.actions';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useState, useEffect } from "react";

function CreateNewNft() {
  const dispatch = useDispatch();
  const [percentage1, setPercentage1] = useState(0);
  const [percentage2, setPercentage2] = useState(0);

  const openSettingUpNftModal = useSelector((state) => state.modal.openSettingUpNftModal);
  const openCreateCollectionModal = useSelector((state) => state.modal.openCreateCollectionModal);
  const openShareCreatedNftModal = useSelector((state) => state.modal.openShareCreatedNftModal);

  const showSettingUpNftModal = () => {
    dispatch(settingUpNftCreateModal(true))
    let timer1 = setInterval(() => {
      if (percentage1 < 100) {
        setPercentage1(percentage1 => percentage1 + 3);
      } else {
      }
    }, 50);
    setTimeout(function () {
      clearInterval(timer1)
    }, 2000)
    let timer2 = setInterval(() => {
      if (percentage2 < 100) {
        setPercentage2(percentage2 => percentage2 + 2);
      } else {
      }
    }, 50);
    setTimeout(function () {
      dispatch(settingUpNftCreateModal(false))
      dispatch(setShareNftCreatedModal(true))
      setPercentage2(0)
      setPercentage1(0)
      clearInterval(timer2)
    }, 2800)
  }

  const closeSettingUpNftModal = () => {
    dispatch(settingUpNftCreateModal(false))
  }

  const showCreateCollectionModal = () => {
    dispatch(setCollectionCreateModal(true))
  }

  const closeCreateCollectionModal = () => {
    dispatch(setCollectionCreateModal(false))
  }
  const closeShareCreatedNftModal = () => {
    dispatch(setShareNftCreatedModal(false))
  }
  return (
    <div className="payment-page">
      <div className={`${openSettingUpNftModal ? '' : 'hidden'} w-full top-0 opacity-50 h-[1800px] bg-zinc-700 absolute z-50`} onClick={() => closeSettingUpNftModal(false)}></div>
      <div className={`${openCreateCollectionModal ? '' : 'hidden'} w-full top-0 opacity-50 h-[1800px] bg-zinc-700 absolute z-50`} onClick={() => closeCreateCollectionModal(false)}></div>
      <div className={`${openShareCreatedNftModal ? '' : 'hidden'} w-full top-0 opacity-50 h-[1800px] bg-zinc-700 absolute z-50`} onClick={() => closeShareCreatedNftModal(false)}></div>

      <div id="setting-up-modal" tabIndex="-1" aria-hidden="true" className={`${openSettingUpNftModal ? '' : 'hidden'} mx-auto fixed mt-16 sm:mt-32 z-50 w-full md:w-[600px] p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-fit`}>
        <div className="relative w-full h-full md:h-auto p-4">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 sm:px-10 px-3 sm:py-10 py-6 w-full text-center">
            <div className='text-center w-12 h-12 mx-auto'>
              <CircularProgressbar value={percentage2} />
            </div>
            <div className="px-6 py-4 rounded-t dark:border-gray-600">
              <h3 className="text-base text-center font-bold text-[#000549] lg:text-2xl dark:text-white">
                Setting up your minting steps
              </h3>
            </div>

            <div className='sm:px-8 px-2'>
              <div className='flex px-4 my-4'>
                <div className='text-center w-8 h-8'>
                  <CircularProgressbar value={percentage1} />
                </div>
                {/* <img src='/imgs/loading.png' className='w-8 h-8 mt-3 mr-3' alt='B' /> */}
                <div>
                  <h3 className='text-[#303C4F] font-bold m-1 text-left'>Upload</h3>
                  <p className='text-[#6E7B91] font-bold m-1 text-sm text-left'>Uploading nft art medias to IPFS server</p>
                </div>
              </div>

              <div className='flex px-4 my-4'>
                {/* <img src='/imgs/loading.png' className='w-8 h-8 mt-3 mr-3' alt='B' />
                 */}
                <div className='text-center w-8 h-8'>
                  <CircularProgressbar value={percentage2} />
                </div>
                <div>
                  <h3 className='text-[#303C4F] font-bold m-1 text-left'>Mint</h3>
                  <p className='text-[#6E7B91] font-bold m-1 text-sm text-left'>Minting on blockchain with wallet</p>
                </div>
              </div>
            </div>
            <button className='bg-[#F0F2F4] rounded-lg py-3 px-4 w-2/3 text-[#303C4F] mx-auto mt-6' onClick={closeSettingUpNftModal}>Cancel</button>
          </div>
        </div>
      </div>

      <div id="share-nft-modal" tabIndex="-1" aria-hidden="true" className={`${openShareCreatedNftModal ? '' : 'hidden'} mx-auto fixed mt-16 sm:mt-32 z-50 w-full md:w-[500px] p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-fit`}>
        <div className="relative w-full h-full md:h-auto p-4">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 sm:px-10 px-3 sm:py-10 py-6 w-full text-center">
            <div className="px-6 py-4 rounded-t dark:border-gray-600">
              <img src='/imgs/nft-img-1.png' className='w-full' />
            </div>
            <div className='text-center px-4 my-4'>
              <p className='text-[#6E7B91] text-lg text-center'>Your <a className='text-[#6823d0] font-bold' href='#'>Abstarct Hand </a>NFT is successfully created. It will be mited in blockchain while purchaing or transferrring</p>
            </div>
            <div className='sm:px-8 px-2 grid grid-cols-4 my-6'>
              <img src="/imgs/share-facebook-icon.png" role='button'/>
              <img src="/imgs/share-twitter-icon.png" role='button'/>
              <img src="/imgs/share-telegram-icon.png" role='button'/>
              <img src="/imgs/share-clipboard-icon.png" role='button' onClick={() => {navigator.clipboard.writeText('created-nft-link')}}/>
            </div>
            <button className='bg-[#F0F2F4] rounded-lg py-3 px-4 w-full text-[#303C4F] mx-auto mt-6'>View NFT</button>
          </div>
        </div>
      </div>

      <div id="create-collection-modal" tabIndex="-1" aria-hidden="true" className={`${openCreateCollectionModal ? '' : 'hidden'} mx-auto fixed mt-1 sm:mt-2 z-50 w-full md:w-[600px] m-8 h-fit md:inset-0 md:h-fit`}>
        <div className="relative w-full h-full md:h-auto p-4">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 sm:px-10 p-4 w-full text-center">
            <div className="px-6 py-4 rounded-t dark:border-gray-600">
              <h3 className="text-base text-center font-bold text-[#000549] lg:text-2xl dark:text-white">
                Collection ERC-721
              </h3>
            </div>
            <p className='text-[#303C4F] mt-8 font-bold text-left'>Load image</p>
            <p className='text-[#6E7B91] my-1 text-left'>Recommended minimum size 350 x 350 px.</p>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Choose File</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, GIF, WEBP, MP4 or MP3. Max 100mb.</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>
            <p className='text-[#303C4F] sm:mt-4 mt-2 font-bold my-1 text-left'>Display Name</p>
            <input className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-1 sm:py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='Collection name' />
            <p className='text-[#303C4F] sm:mt-4 mt-2 font-bold my-1 text-left'>Brand name</p>
            <input className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-1 sm:py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='Brand name' />
            <p className='text-[#303C4F] sm:mt-4 mt-2 font-bold my-1 text-left'>Description</p>
            <textarea className='rounded-lg w-full focus:border-[#864FD9] h-28 border border-[#D3D8DE] px-4 py-1 sm:py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='Collection name' />
            <p className='text-[#303C4F] sm:mt-4 mt-2 font-bold mt-8 text-left'>Short URL</p>
            <input className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-1 sm:py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='koccon.com/ ' />
            <button className='bg-[#6823D0] rounded-lg py-1 sm:py-3 px-4 w-full text-white mx-auto mt-4'>Create Colletion</button>
          </div>
        </div>
      </div>

      <div className='py-5 px-32 w-full h-18 border-b'>
        <img src='/imgs/logo.png' alt="A" />
      </div>
      <div className=' bg-[#FAFAFA] h-fit py-2'>
        <div className='sm:mt-24 mt-10 w-full md:px-60 px-2 block sm:flex-1 justify-center'>
          <div className='mt-2 sm:mt-0'>
            <h1 className='w-full text-center font-bold text-3xl text-[#000549]'>Create New NFT</h1>
            <p className='my-2 text-lg text-center text-[#6E7B91]'>Single edition on Ethereum</p>
          </div>
        </div>
        <div className='mx-auto my-4 sm:my-8 w-[360px] sm:w-[460px]'>
          <p className='text-[#303C4F] font-bold'>Choose wallet</p>
          <div className='p-4 rounded-lg border flex justify-between mt-8'>
            <div className='flex'>
              <img src="/imgs/eth-icon.png" className='h-9 w-9 mr-3' alt='B' />
              <div>
                <p className='text-[#303C4F] font-semibold'>0x63.........c731abs</p>
                <span className='text-[#303C4F] text-xs'>Ethereum</span>
              </div>
            </div>
            <button className='rounded-full border-0 bg-[#1CB23C] px-3 py-1 text-white text-xs'>Connected</button>
          </div>

          <p className='text-[#303C4F] mt-8 font-bold'>Upload file</p>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" />
            </label>
          </div>

          <p className='text-[#303C4F] mt-8 font-bold'>Choose collection</p>
          <div className='flex'>
            <div className='w-1/2 m-2 rounded-lg border h-36 cursor-pointer hover:border-[#6823d0] p-4 text-center bg-whtie' onClick={showCreateCollectionModal} role='button'>
              <img src='/imgs/add-circle.png' className='w-8 mx-auto' alt='B' />
              <p className='text-[#000549] text-sm my-3 font-bold' >Create</p>
              <p className='text-[#6E7B91] text-sm my-3'>ERC - 721</p>
            </div>
            <div className='w-1/2 m-2 rounded-lg border h-36 cursor-pointer hover:border-[#6823d0] p-4 text-center bg-whtie'>
              <img src='/imgs/logo-icon.png' className='w-8 mx-auto' alt='B' />
              <p className='text-[#000549] text-sm my-3 font-bold'>Kocoon</p>
              <p className='text-[#6E7B91] text-sm my-3'>KCN</p>
            </div>
          </div>

          <div className='flex justify-between mt-6'>
            <div>
              <p className='text-[#000549] text my-3 font-bold'>Free minting</p>
              <p className='text-[#6E7B91] text-sm my-3'>Buyer will pay gas fees for minting</p>
            </div>
            <label
              htmlFor="toogleA"
              className="flex items-center cursor-pointer"
            >
              <div className="relative">
                <input id="toogleA" type="checkbox" className="sr-only" />
                <div className="w-14 h-8 bg-[#6823D0] rounded-full shadow-inner"></div>
                <div className="dot absolute w-6 h-6 bg-white rounded-full shadow left-1 top-1 transition"></div>
              </div>
            </label>
          </div>
          <p className='text-[#303C4F] mt-4 font-bold my-1'>Name</p>
          <input className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='Name' />

          <p className='text-[#303C4F] mt-4 font-bold my-1'>Description</p>
          <textarea className='rounded-lg w-full focus:border-[#864FD9] h-28 border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='Add your description here' />

          <p className='text-[#303C4F] mt-4 font-bold my-1'>Loyalty</p>
          <input className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='10%' />

          <button className='text-[#303C4F] rounded-lg bg-[#F0F2F4] px-4 py-3 w-full mt-8'>Show Advance Settings</button>
          <div className='flex mt-4'>
            <input className='rounded-lg w-1/2 mx-1 focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='e.g. Size' />
            <input className='rounded-lg w-1/2 mx-1 focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='e.g. M' />
          </div>

          <button className='flex w-44 mt-4'>
            <i className='fa fa-plus text-[#6823D0] py-1'></i>
            <span className='text-[#6823D0] ml-2 font-semibold max-w-max'>Add more properties</span>
          </button>

          <p className='text-[#303C4F] mt-4 font-bold my-1'>Alternative text for NFT</p>
          <input className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='image description in details' />
          <p className='text-[#6E7B91] text-sm my-3'>Text that will be used in VoiceOver for people with disabilities.</p>

          <button className='text-white bg-[#6823D0] rounded-lg px-4 py-3 w-full mt-4' onClick={showSettingUpNftModal}>Create Item</button>
        </div>
      </div>
    </div>
  );
}

export default CreateNewNft;
