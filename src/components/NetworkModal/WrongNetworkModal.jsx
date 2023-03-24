import { useTranslation } from 'react-i18next';
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { chainIdLocalStorageKey, ChainInfos, connectorLocalStorageKey, networks } from '../../utils';
import useAuth from '../../hooks/useAuth';
// Where page network is not equal to wallet network
export function WrongNetworkModal() {
  const [showWrongNetworkModal, setShowWrongNetworkModal] = useState(true);
  const [showSwitchWallet, setShowSwitchWallet] = useState(false);
  const { t, i18n } = useTranslation();
  const { logout, switchNetwork } = useAuth();

  /**
   * Switch network with chainId
   * @param {*} chainId 
   */
  const switchWallet = (chainId) => {
    setShowWrongNetworkModal(false)
    setShowSwitchWallet(true)
    window.localStorage.setItem(chainIdLocalStorageKey, process.env.REACT_APP_ETH_NETWORK_ID);
    switchNetwork();
  }

  /**
   * Disconnect wallet function
   */
  const disconnectWallet = () => {
    window.localStorage.removeItem(connectorLocalStorageKey);
    logout();
  }

  return (
    <>
      <div className={`${showWrongNetworkModal ? '' : 'hidden'} w-full left-0 top-0 opacity-50 h-[1750px] bg-zinc-700 absolute z-50`} onClick={() => setShowWrongNetworkModal(false)}></div>
      <div className={`flex ${showWrongNetworkModal ? '' : 'hidden'} justify-center top-[180px] absolute w-full left-0`}>
        {!showSwitchWallet ?
          <div className='rounded-2xl bg-white w-[380px] sm:w-[450px] h-[600px] border z-[51]'>
            <div className='bg-slate-200 py-3 px-8 rounded-t-2xl text-[#000549] font-bold text-2xl'>Check your network</div>
            <div className='p-6'>
              <p className='text-[#000549] text-xl text-semibold'>Currently page is only supported in {process.env.REACT_APP_ETH_NETWORK}</p>
              <img src='/imgs/logo-icon.png' className='my-10 mx-auto' />
              <div className='pt-4'>
                <div className='text-amber-400 font-semibold text-center py-4 px-3 border border-amber-400 rounded-lg my-2'><i className='fa fa-exclamation-triangle mr-4'></i>Please switch your network to continue</div>
                <div className='text-white font-semibold text-lg bg-[#6823D0] text-center py-4 px-3 rounded-lg my-2 cursor-pointer' onClick={() => setShowSwitchWallet(true)}>Switch network in wallet</div>
                <div className='text-[#6823D0] font-semibold text-lg text-center py-4 px-3 border border-[#6823D0] rounded-lg my-2 cursor-pointer' onClick={disconnectWallet}>Disconnet Wallet</div>
              </div>
            </div>
          </div>

          : <div className="absolute mt-12 -ml-6 shadow-2xl rounded-xl z-[51]">
            <div className="rounded-xl bg-white p-2 border w-[380px]">
            <div className='py-3 px-8 rounded-t-2xl text-[#000549] font-semibold text-2xl border-b'>Select a network</div>
              <button className='rounded-lg text-slate-600 text-left text-lg my-1 py-4 px-4 w-full font-semibold flex hover:bg-slate-200' onClick={() => switchWallet(process.env.REACT_APP_NODE_ENV === "production" ? 1 : 5)}>
                <img src="/imgs/Coinbase Wallet.png" className="w-8 mr-2" />
                { process.env.REACT_APP_NODE_ENV === "production" ? t('Ethereum') : t('Goerli')}
              </button>
            </div>
          </div>}
      </div>
    </>
  )
}
