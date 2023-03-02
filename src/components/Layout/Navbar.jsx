import ReactFlagsSelect from "react-flags-select";
import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import { useSwitchNetwork } from '../../hooks/useSwitchNetwork';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useBalance
} from 'wagmi'
import { updateWalletInfo } from "../../store/actions/auth.actions";
import { useDispatch, useSelector } from "react-redux";

function Navbar(props) {
  const { navbar, setNavbar, showDropdown, dropDownChange, createNftOption, selectNftCreateOption, showSignUpModal, t, i18n, walletConnected,
    select, onSelectCountry, showSwitchNetworkModal, setShowSwitchNetworkModal, showWalletConnectModal, setShowWalletConnectModal, setSignUpShowModal, openCreateNftModal, closeModals, continueCreateNft, setShowDropdown
  } = props

  const dispatch = useDispatch();
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [showSwitchWallet, setShowSwitchWallet] = useState(false);

  const { address, connector, isConnected } = useAccount()
  const { data } = useBalance({
    address: address ? address : '',
  })

  let walletInfo = {
    address: address,
    isConnected: isConnected,
    balance: data
  }

  const disconnect = useDisconnect({
    onSuccess(data) {
      dispatch(updateWalletInfo({ ...walletInfo }))
      toast.success('Wallet disconnected successfully.')
    },
  })
  const { switchNetworkAsync, canSwitch } = useSwitchNetwork()


  const connect = useConnect({
    onSuccess(data) {
      toast.success('Wallet connected successfully.')
    },
    onError(data) {
      toast.error(data.message)
    },
  })
  // const { data: ensAvatar } = useEnsAvatar({ address })
  // const { data: ensName } = useEnsName({ address })
  const { connectors, error, isLoading, pendingConnector } =
    useConnect()

  const connectWallet = async (connector) => {
    try {
      if (isConnected) {
        setShowWalletConnectModal(false)
        toast.warn('Wallet is already connected.')
      } else {
        await connect.connect({ connector })
        dispatch(updateWalletInfo({ ...walletInfo }))
        isConnected && toast.success('Wallet connected successfully.')
        setShowWalletConnectModal(false)
      }
    } catch (err) {
      console.log(err, 'err');
    }
  }

  const connectBtn = () => {
    setShowWalletOptions(false)
    isConnected ? disconnect.disconnect() : setShowWalletConnectModal(true)
  }

  const switchBtn = () => {
    setShowWalletOptions(false)
    setShowSwitchWallet(true)
    dispatch(updateWalletInfo({ ...walletInfo }))
  }

  const switchWallet = (chainId) => {
    setShowSwitchWallet(false)
    switchNetworkAsync(chainId);
  }

  return (
    <nav className="w-full h-20 border absolute top-0">
      <div className="justify-between px-4 md:items-center md:flex md:px-8">
        <div>
          <div className="flex items-center justify-between py-3 md:py-5 md:block">
            <img src="imgs/logo.png" alt="A" role={'button'} />
            <div className='bg-[#F6F6F6] h-10 md:w-[200px] rounded-lg py-1 px-1 text-center md:hidden flex'>
              <i className="fa fa-search float-left text-[#8b95a7] mt-2 mx-1" aria-hidden="true"></i>
              <input placeholder='Search items, colletions' className='bg-transparent border-0 focus:outline-none text-xs' />
              <img src='imgs/shortcut.png' className='float-right h-4 w-4 mt-2' alt='A' />
            </div>
            <div className="md:hidden">
              <button
                className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className='w-3/4'>
          <div
            className={`flex-1 justify-self-center pb-3 mt-8 md:pb-0 md:mt-0 hidden md:flex justify-between`}
          >
            <div className='bg-[#F6F6F6] h-10 w-[400px] md:w-[300px] rounded-lg py-[10px] px-4 text-center'>
              <i className="fa fa-search float-left text-[#8b95a7]" aria-hidden="true"></i>
              <input placeholder='Search items, colletions' className='bg-transparent border-0 focus:outline-none' />
              <img src='imgs/shortcut.png' className='float-right' alt='A' />
            </div>
            <div className='flex'>
              {isConnected
                ? <div className='flex'>
                  {/* <CountryDropdown id="UNIQUE_ID" className='country-dropdown focus:outline-none' preferredCountries={['gb', 'us']} value="" handleChange={e => countrySelectChange(e)}></CountryDropdown> */}
                  <ReactFlagsSelect
                    selected={select}
                    onSelect={onSelectCountry}
                    countries={["fi", "GB", "IE", "IT", "NL", "SE", "US"]}
                    className='h-10 mx-2 country-selector'
                    placeholder="Select Language"
                    searchable
                    selectedSize={14}
                  />
                  <div className='bg-[#F6F6F6] flex pxy-2 px-3 rounded-lg w-44 justify-between mx-2 h-10'>
                    <img src='imgs/metamask-icon.png' alt='' />
                    <p className='ml-2 #303C4F font-xs w-25 py-2'>{address ? `${address.substr(0, 4) + '...' + address.substr((address.length - 4), 4)}` : ''}</p>
                    <i className={`fa pt-3 ml-2 fa-chevron-down text-slate-500`} aria-hidden="true" role="button" onClick={() => { if (showWalletOptions || showSwitchWallet) { setShowWalletOptions(false); setShowSwitchWallet(false) } else setShowWalletOptions(true) }}></i>
                    {showWalletOptions && <div className="absolute mt-12 -ml-6 shadow-2xl rounded-xl">
                      <div className="rounded-xl bg-white p-2 border w-52">
                        <button className='bg-[#6823D0] rounded-lg text-white text-center my-1 py-2 px-4 w-full font-bold' onClick={connectBtn}>
                          {t('Disconnect Wallet')}
                        </button>
                        <button className='text-[#6823D0] bg-slate-200 rounded-lg text-center my-1 py-2 px-4 w-full font-bold' onClick={switchBtn}>
                          {t('Switch Network')}
                        </button>
                      </div>
                    </div>}

                    {showSwitchWallet && <div className="absolute mt-12 -ml-6 shadow-2xl rounded-xl">
                      <div className="rounded-xl bg-white p-2 border w-56">
                        <p className="border-b text-center py-2 px-3 text-slate-500 text-bold text-xl">Select a network</p>
                        <button className='rounded-lg text-slate-600 text-left my-1 py-2 px-4 w-full font-bold flex hover:bg-slate-200' onClick={() => switchWallet(process.env.REACT_APP_NODE_ENV === "production" ? 1 : 5)}>
                          <img src="imgs/Coinbase Wallet.png" className="w-6 mr-2" />
                          {t('Etherium')}
                        </button>
                      </div>
                    </div>}
                  </div>


                  <div className='inline-flex'><img src='imgs/avatar-1.png' className='w-8 h-8' />
                    <i className={`fa pt-2 ml-2 text-slate-500 ${showDropdown ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden="true" role="button" onClick={() => setShowDropdown(!showDropdown)}></i>
                    <div className={`bg-white shadow border rounded-lg p-2 absolute top-14 right-6 w-[220px] ${showDropdown ? '' : 'hidden'}`}>
                      <ul>
                        <li className='flex px-4 py-3 rounded-lg cursor-pointer hover:text-[#6823D0] hover:bg-[#F1EAFB] text-[#6E7B91]' onClick={() => dropDownChange()}>
                          <i className='fa fa-user pt-1'></i>
                          <span className='ml-3'>My Profile</span>
                        </li>
                        <li className='flex px-4 py-3 rounded-lg cursor-pointer hover:text-[#6823D0] hover:bg-[#F1EAFB] text-[#6E7B91]' onClick={() => dropDownChange()}>
                          <i className='fa fa-file-image-o pt-1'></i>
                          <span className='ml-3'>My Galleries</span>
                        </li>
                        <li className='flex px-4 py-3 rounded-lg cursor-pointer hover:text-[#6823D0] hover:bg-[#F1EAFB] text-[#6E7B91]' onClick={() => dropDownChange()}>
                          <i className='fa fa-minus-square-o pt-1'></i>
                          <span className='ml-3'>My Collections</span>
                        </li>
                        <li className='flex px-4 py-3 rounded-lg cursor-pointer hover:text-[#6823D0] hover:bg-[#F1EAFB] text-[#6E7B91]' onClick={() => dropDownChange()}>
                          <i className='fa fa-exchange pt-1'></i>
                          <span className='ml-3'>My Transactions</span>
                        </li>
                        <li className='flex px-4 py-3 rounded-lg cursor-pointer hover:text-[#6823D0] hover:bg-[#F1EAFB] text-[#6E7B91]' onClick={() => dropDownChange()}>
                          <i className='fa fa-group pt-1'></i>
                          <span className='ml-3'>Team Members</span>
                        </li>
                        <li className='flex px-4 py-3 rounded-lg cursor-pointer hover:text-[#6823D0] hover:bg-[#F1EAFB] text-[#6E7B91]' onClick={() => dropDownChange()}>
                          <i className='fa fa-calendar-minus-o pt-1'></i>
                          <span className='ml-3'>Subscription</span>
                        </li>
                        <li className='flex px-4 py-3 rounded-lg cursor-pointer hover:text-[#6823D0] hover:bg-[#F1EAFB] text-[#6E7B91]' onClick={() => dropDownChange()}>
                          <i className='fa fa-cog pt-1'></i>
                          <span className='ml-3'>Settings</span>
                        </li>
                        <li className='flex px-4 py-3 rounded-lg cursor-pointer hover:text-[#6823D0] hover:bg-[#F1EAFB] text-[#6E7B91]' onClick={() => dropDownChange('signout')}>
                          <i className='fa fa-sign-out pt-1'></i>
                          <span className='ml-3'>Sign out</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                :
                <>
                  <button className='bg-[#6823D0] rounded-lg text-white text-center py-2 px-4 mr-2' onClick={connectBtn}>
                    {isConnected ? t('Disconnect Wallet') : t('Connect Wallet')}
                  </button>
                </>
                // <Web3Button />
              }
            </div>
          </div>
        </div>
      </div>

      <div id="crypto-modal" tabIndex="-1" aria-hidden="true" className={`${showSignUpModal ? '' : 'hidden'} mx-auto fixed mt-16 sm:mt-32 z-50 w-fit p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-fit`}>
        <div className="relative w-full h-full max-w-md md:h-auto">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 sm:px-10 sm:py-5 p-2">
            <button type="button" onClick={() => setSignUpShowModal(false)} className="text-lg absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="crypto-modal">
              <i className='fa fa-times-circle-o'></i>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="px-6 py-4 rounded-t dark:border-gray-600">
              <h3 className="text-base text-center font-bold text-[#000549] lg:text-2xl dark:text-white">
                {t('Connect Wallet')}
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm font-normal text-[#6E7B91] dark:text-gray-400">Choose how you want to connect. There are several wallet providers.</p>
              <ul className="my-4 space-y-1">
                <li>
                  <a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <svg aria-hidden="true" className="h-4" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M39.0728 0L21.9092 12.6999L25.1009 5.21543L39.0728 0Z" fill="#E17726" /><path d="M0.966797 0.0151367L14.9013 5.21656L17.932 12.7992L0.966797 0.0151367Z" fill="#E27625" /><path d="M32.1656 27.0093L39.7516 27.1537L37.1004 36.1603L27.8438 33.6116L32.1656 27.0093Z" fill="#E27625" /><path d="M7.83409 27.0093L12.1399 33.6116L2.89876 36.1604L0.263672 27.1537L7.83409 27.0093Z" fill="#E27625" /><path d="M17.5203 10.8677L17.8304 20.8807L8.55371 20.4587L11.1924 16.4778L11.2258 16.4394L17.5203 10.8677Z" fill="#E27625" /><path d="M22.3831 10.7559L28.7737 16.4397L28.8067 16.4778L31.4455 20.4586L22.1709 20.8806L22.3831 10.7559Z" fill="#E27625" /><path d="M12.4115 27.0381L17.4768 30.9848L11.5928 33.8257L12.4115 27.0381Z" fill="#E27625" /><path d="M27.5893 27.0376L28.391 33.8258L22.5234 30.9847L27.5893 27.0376Z" fill="#E27625" /><path d="M22.6523 30.6128L28.6066 33.4959L23.0679 36.1282L23.1255 34.3884L22.6523 30.6128Z" fill="#D5BFB2" /><path d="M17.3458 30.6143L16.8913 34.3601L16.9286 36.1263L11.377 33.4961L17.3458 30.6143Z" fill="#D5BFB2" /><path d="M15.6263 22.1875L17.1822 25.4575L11.8848 23.9057L15.6263 22.1875Z" fill="#233447" /><path d="M24.3739 22.1875L28.133 23.9053L22.8184 25.4567L24.3739 22.1875Z" fill="#233447" /><path d="M12.8169 27.0049L11.9606 34.0423L7.37109 27.1587L12.8169 27.0049Z" fill="#CC6228" /><path d="M27.1836 27.0049L32.6296 27.1587L28.0228 34.0425L27.1836 27.0049Z" fill="#CC6228" /><path d="M31.5799 20.0605L27.6165 24.0998L24.5608 22.7034L23.0978 25.779L22.1387 20.4901L31.5799 20.0605Z" fill="#CC6228" /><path d="M8.41797 20.0605L17.8608 20.4902L16.9017 25.779L15.4384 22.7038L12.3988 24.0999L8.41797 20.0605Z" fill="#CC6228" /><path d="M8.15039 19.2314L12.6345 23.7816L12.7899 28.2736L8.15039 19.2314Z" fill="#E27525" /><path d="M31.8538 19.2236L27.2061 28.2819L27.381 23.7819L31.8538 19.2236Z" fill="#E27525" /><path d="M17.6412 19.5088L17.8217 20.6447L18.2676 23.4745L17.9809 32.166L16.6254 25.1841L16.625 25.1119L17.6412 19.5088Z" fill="#E27525" /><path d="M22.3562 19.4932L23.3751 25.1119L23.3747 25.1841L22.0158 32.1835L21.962 30.4328L21.75 23.4231L22.3562 19.4932Z" fill="#E27525" /><path d="M27.7797 23.6011L27.628 27.5039L22.8977 31.1894L21.9414 30.5138L23.0133 24.9926L27.7797 23.6011Z" fill="#F5841F" /><path d="M12.2373 23.6011L16.9873 24.9926L18.0591 30.5137L17.1029 31.1893L12.3723 27.5035L12.2373 23.6011Z" fill="#F5841F" /><path d="M10.4717 32.6338L16.5236 35.5013L16.4979 34.2768L17.0043 33.8323H22.994L23.5187 34.2753L23.48 35.4989L29.4935 32.641L26.5673 35.0591L23.0289 37.4894H16.9558L13.4197 35.0492L10.4717 32.6338Z" fill="#C0AC9D" /><path d="M22.2191 30.231L23.0748 30.8354L23.5763 34.8361L22.8506 34.2234H17.1513L16.4395 34.8485L16.9244 30.8357L17.7804 30.231H22.2191Z" fill="#161616" /><path d="M37.9395 0.351562L39.9998 6.53242L38.7131 12.7819L39.6293 13.4887L38.3895 14.4346L39.3213 15.1542L38.0875 16.2779L38.8449 16.8264L36.8347 19.1742L28.5894 16.7735L28.5179 16.7352L22.5762 11.723L37.9395 0.351562Z" fill="#763E1A" /><path d="M2.06031 0.351562L17.4237 11.723L11.4819 16.7352L11.4105 16.7735L3.16512 19.1742L1.15488 16.8264L1.91176 16.2783L0.678517 15.1542L1.60852 14.4354L0.350209 13.4868L1.30098 12.7795L0 6.53265L2.06031 0.351562Z" fill="#763E1A" /><path d="M28.1861 16.2485L36.9226 18.7921L39.7609 27.5398L32.2728 27.5398L27.1133 27.6049L30.8655 20.2912L28.1861 16.2485Z" fill="#F5841F" /><path d="M11.8139 16.2485L9.13399 20.2912L12.8867 27.6049L7.72971 27.5398H0.254883L3.07728 18.7922L11.8139 16.2485Z" fill="#F5841F" /><path d="M25.5283 5.17383L23.0847 11.7736L22.5661 20.6894L22.3677 23.4839L22.352 30.6225H17.6471L17.6318 23.4973L17.4327 20.6869L16.9139 11.7736L14.4707 5.17383H25.5283Z" fill="#F5841F" /></svg>
                    <span className="flex-1 ml-3 whitespace-nowrap"> {t('MetaMask')}</span>
                    <span className="inline-flex items-center justify-center px-2 py-1 ml-3 text-xs font-medium text-white bg-[#1CB23C] rounded dark:bg-gray-700 dark:text-gray-400">Popular</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <svg aria-hidden="true" className="h-5" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient cx="0%" cy="50%" fx="0%" fy="50%" r="100%" id="radialGradient-1"><stop stopColor="#5D9DF6" offset="0%"></stop><stop stopColor="#006FFF" offset="100%"></stop></radialGradient></defs><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="logo"><rect id="base" fill="url(#radialGradient-1)" x="0" y="0" width="512" height="512" rx="256"></rect><path d="M169.209772,184.531136 C217.142772,137.600733 294.857519,137.600733 342.790517,184.531136 L348.559331,190.179285 C350.955981,192.525805 350.955981,196.330266 348.559331,198.676787 L328.82537,217.99798 C327.627045,219.171241 325.684176,219.171241 324.485851,217.99798 L316.547278,210.225455 C283.10802,177.485633 228.89227,177.485633 195.453011,210.225455 L186.951456,218.549188 C185.75313,219.722448 183.810261,219.722448 182.611937,218.549188 L162.877976,199.227995 C160.481326,196.881474 160.481326,193.077013 162.877976,190.730493 L169.209772,184.531136 Z M383.602212,224.489406 L401.165475,241.685365 C403.562113,244.031874 403.562127,247.836312 401.165506,250.182837 L321.971538,327.721548 C319.574905,330.068086 315.689168,330.068112 313.292501,327.721609 C313.292491,327.721599 313.29248,327.721588 313.29247,327.721578 L257.08541,272.690097 C256.486248,272.103467 255.514813,272.103467 254.915651,272.690097 C254.915647,272.690101 254.915644,272.690105 254.91564,272.690108 L198.709777,327.721548 C196.313151,330.068092 192.427413,330.068131 190.030739,327.721634 C190.030725,327.72162 190.03071,327.721606 190.030695,327.721591 L110.834524,250.181849 C108.437875,247.835329 108.437875,244.030868 110.834524,241.684348 L128.397819,224.488418 C130.794468,222.141898 134.680206,222.141898 137.076856,224.488418 L193.284734,279.520668 C193.883897,280.107298 194.85533,280.107298 195.454493,279.520668 C195.454502,279.520659 195.45451,279.520651 195.454519,279.520644 L251.65958,224.488418 C254.056175,222.141844 257.941913,222.141756 260.338618,224.488222 C260.338651,224.488255 260.338684,224.488288 260.338717,224.488321 L316.546521,279.520644 C317.145683,280.107273 318.117118,280.107273 318.71628,279.520644 L374.923175,224.489406 C377.319825,222.142885 381.205562,222.142885 383.602212,224.489406 Z" id="WalletConnect" fill="#FFFFFF" fillRule="nonzero"></path></g></g></svg>
                    <span className="flex-1 ml-3 whitespace-nowrap"> {t('WalletConnect')}</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <svg aria-hidden="true" className="h-5" viewBox="0 0 292 292" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M145.7 291.66C226.146 291.66 291.36 226.446 291.36 146C291.36 65.5541 226.146 0.339844 145.7 0.339844C65.2542 0.339844 0.0400391 65.5541 0.0400391 146C0.0400391 226.446 65.2542 291.66 145.7 291.66Z" fill="#3259A5" /><path d="M195.94 155.5C191.49 179.08 170.8 196.91 145.93 196.91C117.81 196.91 95.0204 174.12 95.0204 146C95.0204 117.88 117.81 95.0897 145.93 95.0897C170.8 95.0897 191.49 112.93 195.94 136.5H247.31C242.52 84.7197 198.96 44.1797 145.93 44.1797C89.6904 44.1797 44.1104 89.7697 44.1104 146C44.1104 202.24 89.7004 247.82 145.93 247.82C198.96 247.82 242.52 207.28 247.31 155.5H195.94Z" fill="white" /></svg>
                    <span className="flex-1 ml-3 whitespace-nowrap"> {t('Coinbase Wallet')}</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <img src='imgs/phantom-icon.png' className='-ml-1' width={28} alt='' />
                    <span className="flex-1 ml-3 whitespace-nowrap">{t('Phantom Wallet')} </span>
                  </a>
                </li>
              </ul>
              <div>
                <a href="#" className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400">
                  <svg aria-hidden="true" className="w-3 h-3 mr-2" focusable="false" data-prefix="far" data-icon="question-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"></path></svg>
                  Why do I need to connect with my wallet?</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="create-nft-modal" tabIndex="-1" aria-hidden="true" className={`${openCreateNftModal ? '' : 'hidden'} mx-auto fixed mt-16 sm:mt-32 z-50 w-full md:w-[800px] p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-fit`}>
        <div className="relative w-full h-full md:h-auto p-4">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 sm:px-10 sm:py-10 p-2 w-full text-center">
            <button type="button" onClick={closeModals} className="text-lg absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="crypto-modal">
              <i className='fa fa-times-circle-o'></i>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="px-6 py-4 rounded-t dark:border-gray-600">
              <h3 className="text-base text-center font-bold text-[#000549] lg:text-2xl dark:text-white">
                Create new NFT
              </h3>
            </div>
            <p className="text-sm font-normal text-[#6E7B91] dark:text-gray-400 text-center">Choose how you want to connect. There are several wallet providers.</p>
            <div className='flex my-4 md:my-10' >
              <div className={`w-1/2 mx-2 rounded-lg hover:border-[#6823D0] border h-fit p-2 md:p-8 text-center justify-center ${createNftOption === 'single' ? 'border-[#6823D0]' : ''}`} role='button' onClick={() => selectNftCreateOption('single')}>
                <img src='imgs/vector-1.png' className='mx-auto my-2' alt='' />
                <h3 className="text-base text-center font-bold text-[#000549] lg:text-lg dark:text-white my-2">
                  Single
                </h3>
                <p className="text-sm font-normal text-[#6E7B91] dark:text-gray-400 text-center my-2">If you want to highlight the uniqueness and individuality of your team.</p>
                <input type="radio" checked={createNftOption === 'single'} onChange={() => { }} />
              </div>

              <div className={`w-1/2 mx-2 rounded-lg hover:border-[#6823D0] border h-fit p-2 md:p-8 text-center justify-center ${createNftOption === 'multiple' ? 'border-[#6823D0]' : ''} `} role='button' onClick={() => selectNftCreateOption('multiple')}>
                <img src='imgs/vector-1.png' className='mx-auto my-2' alt='' />
                <h3 className="text-base text-center font-bold text-[#000549] lg:text-lg dark:text-white my-2">
                  Multiple
                </h3>
                <p className="text-sm font-normal text-[#6E7B91] dark:text-gray-400 text-center my-2">If you want to share your NFT with a large number of community members</p>
                <input type="radio" checked={createNftOption === 'multiple'} onChange={() => { }} />
              </div>
            </div>

            <button className='bg-[#6823D0] rounded-lg py-3 px-4 w-1/2 text-white mx-auto' onClick={continueCreateNft}>Continue</button>
          </div>
        </div>
      </div>


      <div id="wallet-connect-modal" tabIndex="-1" aria-hidden="true" className={`${showWalletConnectModal ? '' : 'hidden'} mx-auto fixed mt-16 sm:mt-32 z-50 w-full md:w-[800px] p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-fit`}>
        <div className="relative w-full h-full md:h-auto p-4">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 sm:px-8 sm:py-20 p-2 w-full text-center">
            <button type="button" onClick={closeModals} className="text-lg absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="crypto-modal">
              <i className='fa fa-times-circle-o'></i>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="px-6 py-4 rounded-t dark:border-gray-600">
              <h3 className="text-base text-center font-bold text-[#000549] lg:text-2xl dark:text-white">
                Connect Wallet
              </h3>
            </div>
            <p className="text-sm font-normal text-[#6E7B91] dark:text-gray-400 text-center">Choose how you want to connect. There are several wallet providers.</p>
            <div className='my-4 mx-auto md:my-10 border w-4/5 rounded-lg'>
              {connectors.map((connector) => (
                <div
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => connectWallet(connector)}
                  className="p-6 flex border-b w-full justify-between cursor-pointer"
                >
                  <div className="flex">
                    <img src={`imgs/${connector.name}.png`} className='w-8' />
                    <p className="text-[#303C4F] font-semibold ml-4 text-lg">
                      {connector.name}
                    </p>
                  </div>
                  {connector.name === 'MetaMask' && <button className="float-right px-3 py-1 rounded-xl bg-[#1CB23C] text-white">
                    Popular
                  </button>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav >
  );
}

export default Navbar;
