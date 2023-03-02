import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setOpenNftCreateModal } from "../../store/actions/auth.actions";
import {
  useAccount,
  useConnect,
  useBalance ,
} from 'wagmi'

function Dashboard() {
  const dispatch = useDispatch();
  const { address, connector, isConnected } = useAccount()

  const [switchValue, setSwitchValue] = useState(1);
  const walletInfo = useSelector((state) => state.auth.walletInfo);


  const createNft = () => {
    dispatch(setOpenNftCreateModal(true));
  }
  const collections = [
    {
      collection: { avatar: 'imgs/avatar-1.png', name: 'Kristin Watson' }, volume: { coin: 'imgs/eth-icon.png', value: 1248534 }, hour: '-20.38%', owner: '6.8k', items: '14.2k'
    },
    {
      collection: { avatar: 'imgs/avatar-1.png', name: 'Kristin Watson' }, volume: { coin: 'imgs/eth-icon.png', value: 1248534 }, hour: '+20.38%', owner: '6.8k', items: '14.2k'
    },
    {
      collection: { avatar: 'imgs/avatar-1.png', name: 'Kristin Watson' }, volume: { coin: 'imgs/eth-icon.png', value: 1248534 }, hour: '-20.38%', owner: '6.8k', items: '14.2k'
    },
  ]

  const nfts = [
    {
      name: 'Crypto Stroefont',
      nft: 'imgs/nft-img-1.png',
      id: 'Ko #1235',
      icon: 'imgs/eth-icon.png',
      followers: 80
    },
    {
      name: 'Crypto Stroefont',
      nft: 'imgs/nft-img-2.png',
      id: 'Ko #1235',
      icon: 'imgs/eth-icon.png',
      followers: 70
    },
    {
      name: 'Crypto Stroefont',
      nft: 'imgs/nft-img-3.png',
      id: 'Ko #1235',
      icon: 'imgs/eth-icon.png',
      followers: 60
    }
  ]

  return (
    <>
      {isConnected ?
        <div className="dashboard py-6 px-4 lg:flex">
          <div className="w-full lg:w-2/3 sm:mx-3 h-[1300px]">
            <div className=" p-6 bg-white rounded-lg">
              <div className="flex justify-between">
                <div className="">
                  <p className="text-[#717E94] text-sm">Hi, Youssef</p>
                  <h1 className="text-[#000549] text-lg font-bold">Explore your NFT Portfolio</h1>
                </div>
                <button className="text-[#6823D1] text-center px-5 py-2 rounded-lg border border-[#6823D1]" onClick={createNft}>Create</button>
              </div>

              <div className="grid grid-cols-4 gap-2 w-full mt-6">
                <div className="bg-[#F6F6F6] rounded-lg p-3 col-span-4 md:col-span-1">
                  <p className="text-sm text-[#717E94]">Owed</p>
                  <p className="text-lg font-semibold text-[#000549]">105</p>
                </div>
                <div className="bg-[#F6F6F6] rounded-lg p-3 col-span-4 md:col-span-1">
                  <p className="text-sm text-[#717E94]">Owed</p>
                  <p className="text-lg font-semibold text-[#000549]">105</p>
                </div>
                <div className="bg-[#F6F6F6] rounded-lg p-3 col-span-4 md:col-span-1">
                  <p className="text-sm text-[#717E94]">Collection</p>
                  <p className="text-lg font-semibold text-[#000549]">03</p>
                </div>
                <div className="bg-[#F6F6F6] rounded-lg p-3 col-span-4 md:col-span-1">
                  <p className="text-sm text-[#717E94]">Owed</p>
                  <p className="text-lg font-semibold text-[#000549]">$320,723.48</p>
                </div>
              </div>
            </div>


            <div className="bg-white mt-4 w-full h-[450px] rounded-lg py-8 px-2 sm:px-6">
              <div className='flex justify-between'>
                <h1 className="text-[#000549] font-bold">Popular Collection</h1>
                <div className="">
                  <div className="flex">
                    <div className="flex bg-[#F6F6F6] p-1 rounded-lg">
                      <div className={`py-2 px-4 text-sm rounded ${switchValue === 1 ? 'text-[#000549] bg-white' : 'text-[#717E94]'}`} role='button' onClick={() => setSwitchValue(1)}>7 Days</div>
                      <div className={`py-2 px-4 text-sm rounded ${switchValue === 2 ? 'text-[#000549] bg-white' : 'text-[#717E94]'}`} role='button' onClick={() => setSwitchValue(2)}>All Time</div>
                    </div>
                    <button className="bg-none ml-2 text-[#717E94]">View All</button>
                  </div>
                </div>
              </div>

              <div className='max-h-[400px] overflow-y-scroll'>
                <table className="min-w-full leading-normal mt-2 border-[#DBE9F3] rounded-xl">
                  <thead className='bg-[#F6F6F6] rounded-xl'>
                    <tr className='rounded-xl'>
                      <th
                        className="sm:px-5 sm:py-3 p-2 text-left text-sm text-[#717E94] tracking-wider">
                        Collection
                      </th>
                      <th
                        className="sm:px-5 sm:py-3 p-2 text-left text-sm text-[#717E94] tracking-wider">
                        Volume
                      </th>
                      <th
                        className="sm:px-5 sm:py-3 p-2 text-left text-sm text-[#717E94] tracking-wider">
                        24h
                      </th>
                      <th
                        className="sm:px-5 sm:py-3 p-2 text-left text-sm text-[#717E94] tracking-wider">
                        Owner
                      </th>
                      <th
                        className="sm:px-5 sm:py-3 p-2 text-left text-sm text-[#717E94] tracking-wider">
                        Items
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections.map((val, ind) => {
                      return (
                        <tr className='border-[#DBE9F3] border border-t-0' key={ind}>
                          <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm w-2/5">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-10 h-10 hidden sm:table-cell">
                                <img className="w-full h-full rounded-full"
                                  src={val.collection['avatar']}
                                  alt="" />
                              </div>
                              <div className="ml-3">
                                <p className="text-[#717E94] whitespace-no-wrap">
                                  {val.collection['name']}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-6 h-6 hidden sm:table-cell">
                                <img className="w-6 h-6 rounded-full"
                                  src={val.volume['coin']}
                                  alt="" />
                              </div>
                              <div className="ml-2">
                                <p className="text-[#717E94] whitespace-no-wrap">
                                  {val.volume['value']}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className={`whitespace-no-wrap text-center ${val.hour.charAt(0) === '-' ? 'text-[#FF6B57]' : 'text-[#1CB23C]'}`}>
                              {val.hour}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-[#717E94] whitespace-no-wrap text-center">
                              {val.owner}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-[#717E94] whitespace-no-wrap text-center">
                              {val.items}
                            </p>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='mt-8 max-h-[350px] overflow-y-scroll'>
              <div>
                <div className='flex justify-between'>
                  <h1 className="text-[#000549] font-bold p-2">Top Nfts</h1>
                  <button className="bg-none ml-2 text-[#717E94] pr-3">View All</button>
                </div>
                <div className='grid grid-cols-3 gap-3'>
                  {nfts.map((val, ind) => {
                    return (
                      <div className='p-2 rounded-lg bg-white' key={ind}>
                        <img src={val.nft} className='rounded-lg w-full' alt='' />
                        <p className='text-sm text-[#717E94] mt-1'>{val.name}</p>
                        <h1 className="text-[#000549] text-sm mt-1">{val.id}</h1>
                        <div className='flex justify-between mt-2'>
                          <div className='flex'><img src={val.icon} className='w-5 h-5' alt='' /><span className='px-2 text-[#717E94] text-sm'>{val.value}</span></div>
                          <div className='flex'><i className='fa fa-heart-o text-[#717E94]' role={'button'}></i><span className='px-2 text-[#717E94] text-sm'>{val.followers}</span></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3 sm:mx-3 h-[800px] ">
            <div className='bg-white p-2 sm:p-6'>
              <div className='flex justify-between my-2'>
                <h1 className='text-[#000549] text-xl font-bold'>Connected Wallet</h1>
                <span className='px-2 text-[#717E94] text-sm' role='button'>Manage</span>
              </div>
              <div className='bg-[#F6F6F6] py-1 px-5 rounded-lg flex justify-between'>
                <div className='flex'>
                  <img src='imgs/metamask-icon.png' alt='' />
                  <p className='ml-2 #303C4F font-xs w-25 py-2'>{address ? `${address.substr(0, 4) + '...' + address.substr((address.length - 4), 4)}` : ''}</p>
                </div>
                <img src='imgs/copy.png' className='h-5 w-5 mt-2' role='button' alt='' onClick={() => { navigator.clipboard.writeText(address) }} />
              </div>
              <p className='mt-4 text-[#717E94]'>Current balance</p>
              <h1 className='mt-2 text-[#000549] text-2xl font-semibold'>$320,723.48</h1>
              <div className='flex justify-between mt-6'>
                <div className='flex'><img src='imgs/eth-icon.png' className='w-5 h-5' alt='' /><span className='px-2 text-[#717E94]'>Etherium</span></div>
                <div><span className='px-2 text-[#717E94]'>$7.67</span></div>
              </div>
              <div className='flex justify-between my-3'>
                <div className='flex'><img src='imgs/bitcoin-icon.png' className='w-5 h-5' alt='' /><span className='px-2 text-[#717E94]'>Etherium</span></div>
                <div><span className='px-2 text-[#717E94]'>$7.67</span></div>
              </div>
              <button className='border border-[#D7E0FD] rounded-lg w-full h-14 py-4 text-[#000549] font-semibold mt-6'>Topup Wallet</button>
            </div>

            <div className='bg-white p-2 sm:p-6 mt-6'>
              <div className='flex justify-between my-2'>
                <h1 className='text-[#000549] text-xl font-bold'>Analytics</h1>
                <span className='px-2 text-[#717E94] text-sm' role='button'>Manage</span>
              </div>
              <div className='h-40 w-40 mx-auto'>
                <div className="pie animate no-round" id='chart-1'></div>
                <div className="pie animate no-round" id='chart-2'></div>
                <div className="pie animate no-round" id='chart-3'>18.24ETH</div>
              </div>
              <div className='flex justify-between my-2'>
                <span className='px-2 text-[#717E94]'>Artwork Sold</span>
                <span className='px-2 text-[#717E94]'>75%</span>
              </div>
              <div className="w-full h-3 mb-4 bg-gray-200 rounded-full dark:bg-gray-700">
                <div className="h-3 bg-[#6823D1] rounded-full dark:bg-blue-500 w-[75%]"></div>
              </div>

              <div className='flex justify-between my-2'>
                <span className='px-2 text-[#717E94]'>Cancelation</span>
                <span className='px-2 text-[#717E94]'>25%</span>
              </div>
              <div className="w-full h-3 mb-4 bg-gray-200 rounded-full dark:bg-gray-700">
                <div className="h-3 bg-[#B796DE] rounded-full dark:bg-blue-500 w-[25%]"></div>
              </div>

              <div className='bg-[#F6F6F6] py-2 px-4 rounded-lg'>
                <p className='text-[#717E94]'>Total Earning</p>
                <div className='mt-3 flex justify-between'>
                  <p className='text-[#000549]'>$30,723.23</p>
                  <div className='flex'><img src='imgs/eth-icon.png' className='w-5 h-5' alt='' /><span className='px-2 text-[#000549]'>18.24</span></div>
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
    </>
  );
}

export default Dashboard;
