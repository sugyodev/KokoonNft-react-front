import React, { Children } from 'react';
import { useState, useEffect } from "react";
import { ethers, providers } from "ethers";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import 'font-awesome/css/font-awesome.min.css';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from "react-redux";
import { setWalletConnectionStatus, updateWalletInfo, setWeb3Modal, setOpenNftCreateModal } from '../../store/actions/auth.actions';
// import * as config from '../config/wallet.config'
import { removeLocalstrage } from '../../utils'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Web3Modal from "web3modal";
import WalletConnectProvider from '@walletconnect/web3-provider'
import { Web3Button, Web3NetworkSwitch } from '@web3modal/react';

const Layout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [navbar, setNavbar] = useState(false);
  const [selectItem, setSelectItem] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSignUpModal, setSignUpShowModal] = useState(false);

  const [showWalletConnectModal, setShowWalletConnectModal] = useState(false);
  const [showSwitchNetworkModal, setShowSwitchNetworkModal] = useState(false);

  const [lang, setLang] = useState('en');
  const [select, setSelectCountry] = useState("SE");
  const [createNftOption, selectNftCreateOption] = useState("single");

  const dispatch = useDispatch();
  const openCreateNftModal = useSelector((state) => state.modal.openCreateNftModal);
  const walletInfo = useSelector((state) => state.auth.walletInfo);
  const walletConnected = useSelector((state) => state.auth.walletConnected);
  const web3Modal = useSelector((state) => state.modal.web3Modal);

  const onSelectCountry = (code) => {
    setSelectCountry(code);
    // i18n.changeLanguage('hn')
  }

  const countrySelectChange = e => {
    setLang(e.target.value);
  }

  // useEffect(() => {
  // }, [])


  const navigate = useNavigate();

  let initPaths = ['/signin', '/joinin', '/signup', '/select-package', '/payment-page', '/payment-success', '/create-new-nft', '/choose-chain'
    , '/create-new-nft/solana', '/create-new-nft/ethereum', '/create-new-nft/tezos', '/create-new-nft/polygon', '/sendemail', '/forgotpwd', '/resetpwd']

  const location = useLocation();
  const isInitPath = initPaths.indexOf(location.pathname) === -1;

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { setSignUpShowModal });
    }
    return child;
  });

  const onConnectBtn = async () => {

  }

  const closeModals = () => {
    dispatch(setOpenNftCreateModal(false));
    setShowWalletConnectModal(false)
  }

  const dropDownChange = async (type) => {
    setShowDropdown(false);
    switch (type) {
      case 'signout':
        try {
          navigate('/signin')
          removeLocalstrage()
        } catch (e) {
          console.log(" onClickDisconnect() exception : ", e);
        }
      default: break;
    }
  }

  const continueCreateNft = () => {
    navigate('/choose-chain');
    dispatch(setOpenNftCreateModal(false));
  }

  return (
    <>
      <React.Fragment>
        <div className='bg-[#FAFAFA] h-fit'>
          {/* Navbar Component */}
          {isInitPath &&
            <>
              <div className={`${openCreateNftModal ? '' : 'hidden'} w-full top-0 opacity-50 h-[110%] bg-zinc-700 absolute z-50`} onClick={() => closeModals()}></div>
              <div className={`${showWalletConnectModal ? '' : 'hidden'} w-full top-0 opacity-50 h-[110%] bg-zinc-700 absolute z-50`} onClick={() => closeModals()}></div>
              
              <Navbar
                navbar={navbar}
                setNavbar={setNavbar}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                dropDownChange={dropDownChange}
                createNftOption={createNftOption}
                openCreateNftModal={openCreateNftModal}
                closeModals={closeModals}
                continueCreateNft={continueCreateNft}
                selectNftCreateOption={selectNftCreateOption}
                showSignUpModal={showSignUpModal}
                setSignUpShowModal={setSignUpShowModal}
                t={t}
                i18n={i18n}
                walletInfo={walletInfo}
                walletConnected={walletConnected}
                onConnectBtn={onConnectBtn}
                select={select}
                onSelectCountry={onSelectCountry}
                showSwitchNetworkModal={showSwitchNetworkModal}
                setShowSwitchNetworkModal={setShowSwitchNetworkModal}
                showWalletConnectModal={showWalletConnectModal}
                setShowWalletConnectModal={setShowWalletConnectModal}
              />
            </>
          }

          {/* Children Component */}
          <div className={`${isInitPath ? 'sm:ml-[300px] mt-20 ' : ''} `}>{childrenWithProps}</div>

          {/* Sidbar Component */}
          {isInitPath &&
            <Sidebar
              navbar={navbar}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              dropDownChange={dropDownChange}
              setSelectItem={setSelectItem}
              selectItem={selectItem}
              showSignUpModal={showSignUpModal}
              setSignUpShowModal={setSignUpShowModal}
              t={t}
              i18n={i18n}
              walletInfo={walletInfo}
              walletConnected={walletConnected}
              onConnectBtn={onConnectBtn}
              select={select}
              onSelectCountry={onSelectCountry}
            />
          }
        </div>
      </React.Fragment>
    </>
  );
};

export default Layout;