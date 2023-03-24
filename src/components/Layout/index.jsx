import React from 'react';
import { useState, useEffect } from "react";
import 'font-awesome/css/font-awesome.min.css';
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from "react-redux";
import { setOpenNftCreateModal } from '../../store/actions/auth.actions';
// import * as config from '../config/wallet.config'
import { removeLocalstrage } from '../../utils'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import useAuth from '../../hooks/useAuth';
// import { toast } from 'react-toastify';

const Layout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const [navbar, setNavbar] = useState(false);
  const [selectItem, setSelectItem] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSignUpModal, setSignUpShowModal] = useState(false);
  const [lang, setLang] = useState('en');
  const [select, setSelectCountry] = useState("SE");
  const [createNftOption, selectNftCreateOption] = useState("single");
  const [showWalletConnectModal, setShowWalletConnectModal] = useState(false);
  const [showSwitchNetworkModal, setShowSwitchNetworkModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const openCreateNftModal = useSelector((state) => state.modal.openCreateNftModal);
  const walletInfo = useSelector((state) => state.auth.walletInfo);
  const walletConnected = useSelector((state) => state.auth.walletConnected);

  let initPaths = ['/signin', '/joinin', '/signup', '/select-package', '/payment-page', '/payment-success', '/create', '/choose-chain'
    , '/sendemail', '/forgotpwd', '/resetpwd', '/confirm_email']
  const isInitPath = initPaths.indexOf("/" + location.pathname.split("/")[1]) === -1;

  const onSelectCountry = (code) => {
    setSelectCountry(code);
    // i18n.changeLanguage('hn')
  }

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { setSignUpShowModal });
    }
    return child;
  });

  const closeModals = () => {
    dispatch(setOpenNftCreateModal(false));
    setShowWalletConnectModal(false)
  }

  const dropDownChange = async (type) => {
    setShowDropdown(false);
    switch (type) {
      case 'signout':
        try {
          removeLocalstrage()
          logout();
          navigate('/signin')
        } catch (e) {
          console.log(" onClickDisconnect() exception : ", e);
        }
      default: break;
    }
  }

  const continueCreateNft = () => {
    navigate(`/choose-chain/${createNftOption}`);
    dispatch(setOpenNftCreateModal(false));
  }

  useEffect(() => {
    if (localStorage.getItem('loginStatus') !== 'true' && location.pathname !== '/signin' && !location.pathname.includes("resetpwd")) {
      navigate('/signin');
    }
  }, [])

  return (
    <>
      <React.Fragment>
        <div className='bg-[#FAFAFA] h-fit'>
          {/* Navbar Component */}
          {isInitPath &&
            <>
              <div className={`${openCreateNftModal ? '' : 'hidden'} w-full top-0 opacity-50 h-[120%] bg-zinc-700 absolute z-50`} onClick={() => closeModals()}></div>
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
                walletInfo={walletInfo}
                walletConnected={walletConnected}
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