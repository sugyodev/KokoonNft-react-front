import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setOpenNftCreateModal } from "../../store/actions/auth.actions";
import { WrongNetworkModal } from '../../components/NetworkModal/WrongNetworkModal';
import Web3WalletContext from '../../hooks/Web3ReactManager';
import { getCurrentNetwork, networks, SUPPORTED_CHAIN_IDS, truncateWalletString } from '../../utils';
import axios from 'axios';

function Dashboard() {
  const { loginStatus, chainId, account, library } = useContext(Web3WalletContext)
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [items, setItems] = useState([]);
  const [topUp, setTopUp] = useState(false);
  const [switchValue, setSwitchValue] = useState(1);
  const [viewAllNfts, setViewAllNfts] = useState(false);
  const [collections, setCollections] = useState([]);
  const userInfo = useSelector((state) => state.auth.userInfo);
  
  const createNft = () => {
    dispatch(setOpenNftCreateModal(true));
  }

  /**
   * Get all user collections with account
   */
  async function fetchCollections() {
    axios
      .get(`/api/collection`, {
        params: {
          owner: account?.toLowerCase(),
        },
      })
      .then((res) => {
        setCollections(res.data.collections);
      })
      .catch((err) => { });
  }


  /**
   * Get all user nft items
   */
  function fetchItems() {
    let paramData = {
      page: page,
      owner: account,
    };
    axios
      .get(`/api/item`, { params: paramData })
      .then((res) => {
        setItems(res.data.items);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (loginStatus && account) {
      fetchItems();
      fetchCollections();
    }
  }, [loginStatus, account]);

  return (
    <>
      {(loginStatus && userInfo?.isApproved) ?
        <div className="dashboard py-6 px-4 lg:flex">
          <div className="w-full lg:w-3/4 sm:mx-3 h-[1600px]">
            <div className=" p-6 bg-white rounded-lg">
              <div className="flex justify-between">
                <div className="">
                  <p className="text-[#717E94] my-1 font-[500]">Hi, {userInfo?.email}</p>
                  <h1 className="text-[#000549] text-3xl font-bold">Explore your NFT Portfolio</h1>
                </div>
                <button className="text-[#6823D0] text-center px-3 py-1 rounded-lg border border-[#6823D1] font-semibold sm:h-12 w-48 h-fit" onClick={createNft}>Create New NFT </button>
              </div>

              <div className="grid grid-cols-4 gap-2 w-full mt-6">
                <div className="bg-[#F6F6F6] rounded-lg p-3 col-span-4 md:col-span-1">
                  <p className=" text-[#717E94] font-[500]">Owed</p>
                  <p className="text-xl mt-1 font-sans font-[500] text-[#000549]">105</p>
                </div>
                <div className="bg-[#F6F6F6] rounded-lg p-3 col-span-4 md:col-span-1">
                  <p className=" text-[#717E94] font-[500]">Created</p>
                  <p className="text-xl mt-1 font-sans font-[500] text-[#000549]">105</p>
                </div>
                <div className="bg-[#F6F6F6] rounded-lg p-3 col-span-4 md:col-span-1">
                  <p className=" text-[#717E94] font-[500]">Collection</p>
                  <p className="text-xl mt-1 font-sans font-[500] text-[#000549]">03</p>
                </div>
                <div className="bg-[#F6F6F6] rounded-lg p-3 col-span-4 md:col-span-1">
                  <p className=" text-[#717E94] font-[500]">Owed</p>
                  <p className="text-xl mt-1 font-sans font-[500] text-[#000549]">$320,723.48</p>
                </div>
              </div>
            </div>


            <div className="bg-white mt-4 w-full h-[450px] rounded-lg py-8 px-2 sm:px-6">
              <div className='flex justify-between'>
                <h1 className="text-[#000549] text-2xl font-bold">Popular Collection</h1>
                <div className="">
                  <div className="flex">
                    <div className="flex bg-[#F6F6F6] p-1 rounded-lg">
                      <div className={`py-2 px-4 font-[500] rounded ${switchValue === 1 ? 'text-[#000549] bg-white' : 'text-[#717E94]'}`} role='button' onClick={() => setSwitchValue(1)}>7 Days</div>
                      <div className={`py-2 px-4 font-[500] rounded ${switchValue === 2 ? 'text-[#000549] bg-white' : 'text-[#717E94]'}`} role='button' onClick={() => setSwitchValue(2)}>All Time</div>
                    </div>
                    <button className="bg-none ml-2 text-[#717E94] text-lg font-[500]">View All</button>
                  </div>
                </div>
              </div>

              <div className='max-h-[400px] overflow-y-scroll'>
                <table className="min-w-full leading-normal mt-2 border-[#F0F2F4] rounded-xl rounded">
                  <thead className='bg-[#F6F6F6] rounded-xl border border-[#F0F2F4] rounded'>
                    <tr className='rounded-xl'>
                      <th
                        className="sm:px-5 sm:py-3 p-2 text-left font-[500] text-[#717E94] tracking-wider">
                        Collection
                      </th>
                      <th
                        className="sm:px-5 sm:py-3 p-2 text-left font-[500] text-[#717E94] tracking-wider">
                        Volume
                      </th>
                      <th
                        className="sm:px-5 sm:py-3 p-2 text-left font-[500] text-[#717E94] tracking-wider text-center">
                        24h
                      </th>
                      <th
                        className="sm:px-5 sm:py-3 p-2 text-left font-[500] text-[#717E94] tracking-wider text-center">
                        Owner
                      </th>
                      <th
                        className="sm:px-5 sm:py-3 p-2 text-left font-[500] text-[#717E94] tracking-wider text-center">
                        Items
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections.map((collection, ind) => {
                      return (
                        <tr className='border-[#F0F2F4] border border-t-0 font-[500]' key={ind}>
                          <td className="px-5 py-4 border-b border-[#F0F2F4] bg-white  w-2/5">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-10 h-10 hidden sm:table-cell">
                                <img className="w-full h-full rounded-full"
                                  src={collection.logo_uri}
                                  alt="" />
                              </div>
                              <div className="ml-3">
                                <p className="text-[#717E94] whitespace-no-wrap">
                                  {collection.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5 border-b border-[#F0F2F4] bg-white ">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-6 h-6 hidden sm:table-cell">
                                <img className="w-6 h-6 rounded-full"
                                  src={networks[chainId]?.LOGO}
                                  alt="" />
                              </div>
                              <div className="ml-2">
                                <p className="text-[#717E94] whitespace-no-wrap">
                                  {collection.volume}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5 border-b border-[#F0F2F4] bg-white">
                            {/* <p className={`whitespace-no-wrap text-center ${collection.volume?.charAt(0) === '-' ? 'text-[#FF6B57]' : 'text-[#1CB23C]'}`}> */}
                            <p className={`whitespace-no-wrap text-center ${collection.volume === 0 ? 'text-[#FF6B57]' : 'text-[#1CB23C]'}`}>
                              {collection.volume}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-[#F0F2F4] bg-white ">
                            <p className="text-[#717E94] whitespace-no-wrap text-center">
                              {collection.volume}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-[#F0F2F4] bg-white ">
                            <p className="text-[#717E94] whitespace-no-wrap text-center">
                              {collection.itemCount}
                            </p>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='mt-8 max-h-[550px] overflow-y-scroll'>
              <div>
                <div className='flex justify-between'>
                  <h1 className="text-[#000549] font-bold p-2 text-2xl">Top Nfts</h1>
                  <button className="bg-none ml-2 text-[#717E94] pr-3 font-[500] text-lg" onClick={() => setViewAllNfts(true)}>View All</button>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 '>
                  {items.map((item, ind) => {
                    return (
                      (ind < 3 && !viewAllNfts || viewAllNfts) && <div className='p-2 rounded-lg bg-white' key={ind}>
                        <div className='h-4/5'>
                          <img src={item.preview ? item.preview : item.assetUrl} className='rounded-lg w-full h-full' alt='' />
                        </div>
                        <p className=' text-[#717E94] mt-1 text-lg px-1 font-[500]'>{item.name}</p>
                        <h1 className="text-[#000549] mt-1 text-lg px-1 font-semibold">#{item.tokenId}</h1>
                        <div className='flex justify-between mt-2 px-1 font-[500]'>
                          <div className='flex'><img src={networks[chainId]?.LOGO} className='w-5 h-5 mt-[3px]' alt='' /><span className='px-2 text-[#717E94] text-lg'>{0}</span></div>
                          <div className='flex'><i className='fa fa-heart-o text-[#717E94] mt-1' role={'button'}></i><span className='px-2 text-[#717E94] text-lg'>{0}</span></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/4 sm:mx-3 h-[800px] ">
            <div className='bg-white p-2 sm:p-6'>
              <div className='flex justify-between my-2'>
                <h1 className='text-[#000549] text-xl font-bold'>Connected Wallet</h1>
                <span className='px-2 text-[#717E94] text-lg font-[500]' role='button'>Manage</span>
              </div>
              <div className='bg-[#F6F6F6] py-3 px-5 rounded-lg flex justify-between h-16'>
                <div className='flex'>
                  <img src='/imgs/metamask-icon.png' alt='' />
                  <p className='ml-2 text-[#6E7B91] font-xs w-25 py-2 font-[500]'>{loginStatus && account ? `${truncateWalletString(account)}` : ''}</p>
                </div>
                <div className='flex'>
                  <img src='/imgs/copy.png' className='h-5 w-5 mt-2' role='button' alt='' onClick={() => { navigator.clipboard.writeText(account) }} />
                  <i className={`fa pt-3 ml-2 fa-chevron-down text-slate-500 font-[500]`} aria-hidden="true" role="button"></i>
                </div>
              </div>
              <p className='mt-4 text-[#717E94] text-lg font-[500]'>Current balance</p>
              <h1 className='mt-2 text-[#000549] text-2xl font-[500]'>$320,723.48</h1>
              <div className='flex justify-between mt-6 text-lg'>
                <div className='flex'><img src='/imgs/eth-icon.png' className='w-6 h-6' alt='' /><span className='px-2 text-[#717E94] font-[500]'>Ethereum</span></div>
                <div><span className='px-2 text-[#717E94] font-[500]'>$7.67</span></div>
              </div>
              <div className='flex justify-between my-6 text-lg'>
                <div className='flex'><img src='/imgs/bitcoin-icon.png' className='w-6 h-6' alt='' /><span className='px-2 text-[#717E94] font-[500]'>Ethereum</span></div>
                <div><span className='px-2 text-[#717E94] font-[500]'>$7.67</span></div>
              </div>
              <button className='border border-[#D7E0FD] rounded-lg w-full h-16 py-4 text-lg text-[#000549] font-bold mt-6' onClick={() => setTopUp(!topUp)}>Topup Wallet</button>
              {userInfo.address?.length > 0 && topUp &&
                <div className='py-2'>
                  {userInfo.address.map((val, ind) => {
                    return (
                      <div className='bg-[#F6F6F6] py-3 my-1 px-5 rounded-lg flex justify-between h-16'>
                        <div className='flex'>
                          <img src='/imgs/metamask-icon.png' alt='' />
                          <p className='ml-2 text-[#6E7B91] font-xs w-25 py-2 font-[500]'>{truncateWalletString(val)}</p>
                        </div>
                        <div className='flex'>
                          <img src='/imgs/copy.png' className='h-5 w-5 mt-2' role='button' alt='' onClick={() => { navigator.clipboard.writeText(val) }} />
                          <i className={`fa pt-3 ml-2 fa-chevron-down text-slate-500 font-[500]`} aria-hidden="true" role="button"></i>
                        </div>
                      </div>
                    )
                  })}
                </div>
              }
            </div>

            <div className='bg-white p-2 sm:p-6 mt-6'>
              <div className='flex justify-between my-2'>
                <h1 className='text-[#000549] text-xl font-bold'>Analytics</h1>
                <span className='px-2 text-[#717E94] text-lg font-[500]' role='button'>Manage</span>
              </div>
              <div className='h-56 w-56 mx-auto'>
                <div className="pie animate no-round" id='chart-1'></div>
                <div className="pie animate no-round" id='chart-2'></div>
                <div className="pie animate no-round" id='chart-3'><div className='font-[500]'>18.24 <span className='text-[#6E7B91]'>ETH</span></div></div>
              </div>
              <div className='flex justify-between my-2'>
                <span className='px-2 text-[#717E94] font-[500]'>Artwork Sold</span>
                <span className='px-2 text-[#717E94] font-[500]'>75%</span>
              </div>
              <div className="w-full h-3 mb-4 bg-gray-200 rounded-full dark:bg-gray-700">
                <div className="h-3 bg-[#6823D1] rounded-full dark:bg-blue-500 w-[75%]"></div>
              </div>

              <div className='flex justify-between my-2'>
                <span className='px-2 text-[#717E94] font-[500]'>Cancelation</span>
                <span className='px-2 text-[#717E94] font-[500]'>25%</span>
              </div>
              <div className="w-full h-3 mb-4 bg-gray-200 rounded-full dark:bg-gray-700">
                <div className="h-3 bg-[#B796DE] rounded-full dark:bg-blue-500 w-[25%]"></div>
              </div>

              <div className='bg-[#F6F6F6] py-2 px-4 rounded-lg'>
                <p className='text-[#6E7B91] text-lg'>Total Earning</p>
                <div className='mt-3 flex justify-between'>
                  <p className='text-[#000549] font-semibold text-lg'>$30,723.23</p>
                  <div className='flex'><img src='/imgs/eth-icon.png' className='w-5 h-5' alt='' /><span className='px-2 text-[#000549] font-semibold'>18.24</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        :
        <div className='h-80 w-full bg-white py-20 text-center text-3xl text-[#9aa4b5]'>
          No wallet connected
        </div>
      }
      {/* {loginStatus && !SUPPORTED_CHAIN_IDS.includes(chainId) && <WrongNetworkModal />} */}
    </>
  );
}

export default Dashboard;
