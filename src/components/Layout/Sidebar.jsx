import ReactFlagsSelect from "react-flags-select";

function Sidebar(props) {
  const { navbar, showDropdown, dropDownChange, t, i18n, walletInfo, walletConnected,
    select, onSelectCountry, onConnectBtn, setShowDropdown, selectItem, setSelectItem } = props

  return (
    <div className={`w-[300px] h-[calc(100%)] border-t-0 border absolute left-0 top-20 p-6 sm:block z-[2] bg-white sidebar transition-all duration-300 shrink-0 ${navbar ? "block" : "hidden"}`}>

      <div className='block md:hidden border-b pb-2'>
        {walletConnected
          ? <div className='block'>
            <ReactFlagsSelect
              selected={select}
              onSelect={onSelectCountry}
              countries={["fi", "GB", "IE", "IT", "NL", "SE", "US"]}
              className='h-10 mx-2 country-selector my-1'
              placeholder="Select Language"
              searchable
              selectedSize={14}
            />
            <div className='bg-[#F6F6F6] flex pxy-2 px-3 rounded-lg w-full my-1 justify-between mr-2 h-10'>
              <img src='imgs/metamask-icon.png' alt='' />
              <p className='ml-2 #303C4F font-xs w-25 py-2'>{walletInfo?.address ? `${walletInfo.address.substr(0, 4) + '...' + walletInfo.address.substr((walletInfo.address.length - 4), 4)}` : ''}</p>
              <i className={`fa pt-3 ml-2 fa-chevron-down text-slate-500`} aria-hidden="true" role="button"></i>
            </div>
            <div className='inline-flex my-1 w-full justify-between px-4'><img src='imgs/avatar-1.png' className='w-8 h-8' />
              <i className={`fa pt-2 ml-2 text-slate-500 float-right ${showDropdown ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden="true" role="button" onClick={() => setShowDropdown(!showDropdown)}></i>
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
          : <button className='bg-[#6823D0] rounded-lg text-white text-center py-2 px-4' onClick={() => { }}>
            {t('Connect Wallet')}
          </button>}
      </div>
      <p className='text-[12px] p-3 text-[#6E7B91]'>
        {t('Menu')}
      </p>

      <div>
        <div onMouseOver={(e) => { e.target.children[0].src = 'imgs/dashboard-icon-1.png' }} onMouseOut={(e) => { if (selectItem !== 'item1') e.target.children[0].src = 'imgs/dashboard-icon.png' }} className={`hover:text-[#6823D0] hover:bg-[#F1EAFB] my-1 flex px-4 py-3 rounded-lg cursor-pointer ${selectItem === 'item1' ? 'bg-[#F1EAFB] text-[#6823D0]' : 'text-[#6E7B91]'}`} onClick={() => setSelectItem('item1')}>
          <img src={`${selectItem === 'item1' ? 'imgs/dashboard-icon-1.png' : 'imgs/dashboard-icon.png'}`} className='h-5 w-5 mr-2' alt="A" />
          {t('Dashboard')}
        </div>
        <div onMouseOver={(e) => { e.target.children[0].src = 'imgs/nft-icon-1.png' }} onMouseOut={(e) => { if (selectItem !== 'item2') e.target.children[0].src = 'imgs/nft-icon.png' }} className={`hover:text-[#6823D0] hover:bg-[#F1EAFB] my-1 flex px-4 py-3 rounded-lg cursor-pointer ${selectItem === 'item2' ? 'bg-[#F1EAFB] text-[#6823D0]' : 'text-[#6E7B91]'}`} onClick={() => setSelectItem('item2')}>
          <img src={`${selectItem === 'item2' ? 'imgs/nft-icon-1.png' : 'imgs/nft-icon.png'}`} className='h-5 w-5 mr-2' alt="A" />
          {t('Nfts')}
        </div>
        <div onMouseOver={(e) => { e.target.children[0].src = 'imgs/collection-icon-1.png' }} onMouseOut={(e) => { if (selectItem !== 'item3') e.target.children[0].src = 'imgs/collection-icon.png' }} className={`hover:text-[#6823D0] hover:bg-[#F1EAFB] my-1  flex px-4 py-3 rounded-lg cursor-pointer ${selectItem === 'item3' ? 'bg-[#F1EAFB] text-[#6823D0]' : 'text-[#6E7B91]'}`} onClick={() => setSelectItem('item3')}>
          <img src={`${selectItem === 'item3' ? 'imgs/collection-icon-1.png' : 'imgs/collection-icon.png'}`} className='h-5 w-5 mr-2' alt="A" />
          {t('Collection')}
        </div>
        <div className='bg-[#6823D0] rounded-lg border-0 text-center text-white px-4 py-3 mt-6 cursor-pointer flex text-center justify-center'>
          <i className="fa fa-plus mt-1 mx-2" aria-hidden="true"></i>
          {t('Create')}
          <i className="fa fa-user-plus mt-1 mx-2" aria-hidden="true"></i>
        </div>
      </div>
      <div className='absolute bottom-0 w-4/5'>
        <div onMouseOver={(e) => { e.target.children[0].src = 'imgs/support-icon-1.png' }} onMouseOut={(e) => { if (selectItem !== 'item4') e.target.children[0].src = 'imgs/support-icon.png' }} className={`hover:text-[#6823D0] hover:bg-[#F1EAFB] my-1 flex px-4 py-3 rounded-lg cursor-pointer ${selectItem === 'item4' ? 'bg-[#F1EAFB] text-[#6823D0]' : 'text-[#6E7B91]'}`} onClick={() => setSelectItem('item4')}>
          <img src={`${selectItem === 'item4' ? 'imgs/support-icon-1.png' : 'imgs/support-icon.png'}`} className='h-5 w-5 mr-2' alt="A" />
          {t('Help & Support')}
        </div>
        <div onMouseOver={(e) => { e.target.children[0].src = 'imgs/faq-icon-1.png' }} onMouseOut={(e) => { if (selectItem !== 'item5') e.target.children[0].src = 'imgs/faq-icon.png' }} className={`hover:text-[#6823D0] hover:bg-[#F1EAFB] my-1 flex px-4 py-3 rounded-lg cursor-pointer ${selectItem === 'item5' ? 'bg-[#F1EAFB] text-[#6823D0]' : 'text-[#6E7B91]'}`} onClick={() => setSelectItem('item5')}>
          <img src={`${selectItem === 'item5' ? 'imgs/faq-icon-1.png' : 'imgs/faq-icon.png'}`} className='h-5 w-5 mr-2' alt="A" />
          {t('Faq')}
        </div>
        <div className='justify-between flex p-3 my-3'>
          <div>
            <img src='imgs/avatar-1.png' width={30} className='absolute' alt="A" />
            <img src='imgs/avatar-1.png' width={30} className='absolute left-8' alt="A" />
            <span className='absolute rounded-full bg-slate-200 w-8 h-8 left-12 text-center pt-1 text-[14px] text-[#6E7B91]'>+3</span>
          </div>
          <div className='border border-slate-300 rounded-lg px-4 py-2 cursor-pointer text-[#6E7B91] hover:text-[#6823D0] hover:bg-[#F1EAFB]'>Invite <i className='fa fa-user-plus'></i></div>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;
