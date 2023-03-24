import '../../App.css';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { settingUpNftCreateModal, setCollectionCreateModal, setShareNftCreatedModal } from '../../store/actions/auth.actions';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useState, useEffect, useContext } from "react";
import { connectorLocalStorageKey, networks, NFT_ERC_TYPES, NFT_TYPES, SUPPORTED_CHAIN_IDS, truncateWalletString } from '../../utils';
import { toast } from 'react-toastify';
import { getIpfsHash, getIpfsHashFromFile } from '../../utils/ipfs';
import { deployCollection, addSingleItem, addMultiItem, getTokenId } from '../../utils/contracts';
import axios from 'axios';
import Web3WalletContext from '../../hooks/Web3ReactManager';
import { useTranslation } from 'react-i18next';
import { getConnector, signMessage } from '../../utils/web3React';

function CreateNewNft() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { loginStatus, chainId, account, library } = useContext(Web3WalletContext)

  const pathname = window.location.pathname;
  const nftType = pathname.split("/")[pathname.split("/").length - 1];
  const isSingle = (nftType === 'single')
  const chainName = pathname.split("/")[pathname.split("/").length - 2];

  const isNotSupported = !NFT_ERC_TYPES[nftType] || networks[chainId]?.KEY !== chainName;  
  const [percentage1, setPercentage1] = useState(100);
  const [percentage2, setPercentage2] = useState(100);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isMinted, setIsMinted] = useState(false);

  //Collection Data
  const collectionUrlPrefix = 'https://kocoon.app/collection/';
  const [collections, setCollections] = useState([]);
  const [newCollection, setNewCollection] = useState({
    'display': '',
    'brand': '',
    'shorturl': '',
    'desc': '',
    'file': { type: '', data: '', thumb: '' }
  })

  //Nft Data
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [royalty, setRoyalty] = useState(0);
  const [supply, setSupply] = useState(0);

  const [freeMint, setFreeMint] = useState(false);
  const [nftFile, setNftFile] = useState({ type: '', data: '', thumb: '' });
  const [properties, setProperties] = useState([{ trait_type: '', value: '' }]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  //Modal Control
  const openSettingUpNftModal = useSelector((state) => state.modal.openSettingUpNftModal);
  // const openSettingUpNftModal = true;
  const openCreateCollectionModal = useSelector((state) => state.modal.openCreateCollectionModal);
  const openShareCreatedNftModal = useSelector((state) => state.modal.openShareCreatedNftModal);

  /**
   * Create a new Nft 
   * @returns show shareCreatedNftModal 
   */
  const showSettingUpNftModal = async () => {
    if (!loginStatus) {
      toast.error(t("Please connect your wallet correctly."));
      return;
    }
    if (!nftFile.data) {
      toast.error("NFT " + t(" file is Required."));
      return;
    }
    if (nftFile.type == "video" && !nftFile.thumb) {
      toast.error("NFT" + t(" logo image is required"));
      return;
    }
    if (!selectedCollection) {
      toast.error(t("You must select at least one collection."));
      return;
    }
    if (!name) {
      toast.error(t("NFT name is required."));
      return;
    }
    if (!description) {
      toast.error(t("NFT description is required."));
      return;
    }
    if (!royalty) {
      toast.error(t("NFT royalty is required."));
      return;
    }
    if (royalty > 10) {
      toast.error(t("NFT royalty is can't be bigger than 10."));
      return;
    }
    // if (properties.length > 0) {
    //   let isValid = true
    //   properties.map((val) => {
    //     if (!val.trait_type || !val.value) {
    //       isValid = false
    //       return;
    //     }
    //   })
    //   if (!isValid && showAdvancedSettings) {
    //     toast.error(t("Complete all the properties."))
    //     return
    //   }
    // }
    if (!isSingle && !supply && supply <= 0) {
      toast.error("ERC1155 " + t(" supply is required."));
      return;
    }
    //const load_toast_id = toast.loading(t("Please wait..."));
    dispatch(settingUpNftCreateModal(true))
    try {
      // let timer1 = setInterval(() => {
      //   if (percentage1 < 100) {
      //     setPercentage1(percentage1 => percentage1 + 2);
      //   } else {
      //   }
      // }, 140);
      // setTimeout(function () {
      //   clearInterval(timer1)
      // }, 7200)

      // let timer2 = setInterval(() => {
      //   if (percentage2 < 100) {
      //     setPercentage2(percentage2 => percentage2 + 2);
      //   } else {
      //   }
      // }, 180);

      // setTimeout(function () {
      //   clearInterval(timer2)
      //   dispatch(settingUpNftCreateModal(false))
      // }, 9500)

      let hash = await getIpfsHashFromFile(nftFile.data);
      const assetUrl = `https://${process.env.REACT_APP_PINATA_GATEWAY}/ipfs/${hash}`;
      let previewUrl = "";
      if (nftFile.type === "video" || nftFile.type === "audio") {
        let previewHash = await getIpfsHashFromFile(nftFile.thumb);
        previewUrl = `https://${process.env.REACT_APP_PINATA_GATEWAY}/ipfs/${previewHash}`;
      }
      let metaData = {
        assetType: nftFile.type,
        image: nftFile.type === "video" ? previewUrl : assetUrl,
        animation_url: nftFile.type === "video" ? assetUrl : "",
        name: name,
        description: description,
        attributes: properties,
        itemCollection: selectedCollection.address,
      };
      setIsUploaded(true);
      const metaDataHash = await getIpfsHash(metaData);
      const tokenUri = `https://${process.env.REACT_APP_PINATA_GATEWAY}/ipfs/${metaDataHash}`;
      setIsMinted(true)
      if (freeMint) {
        const tokenId = await getTokenId(
          isSingle,
          selectedCollection.address,
          chainId,
          library.getSigner()
        );
        if (!tokenId) return;
        const msg = await signMessage(
          getConnector(window.localStorage.getItem(connectorLocalStorageKey)),
          library,
          account,
          "Royalty : " +
          royalty +
          " Account : " +
          account +
          " Token URI : " +
          tokenUri
        );
        let postdata = {
          account: account,
          itemCollection: selectedCollection.address,
          tokenId: tokenId,
          tokenUri: tokenUri,
          type: nftType,
          supply: isSingle ? 1 : 'numCopy',
          royalty: royalty,
          message: msg,
        };
        await axios
          .post(`/api/additem/`, postdata)
          .then((res) => {
            toast.success("NFT " + t("productIscreated"));
            //toast.dismiss(load_toast_id);
            navigate(`/dashboard`);
          })
          .catch((err) => {
            //toast.dismiss(load_toast_id);
            toast.error(t("invalidAddSig"));
          });
      } else {
        let isCreated = isSingle
          ? await addSingleItem(
            selectedCollection.address,
            tokenUri,
            royalty * 10,
            chainId,
            library.getSigner()
          )
          : await addMultiItem(
            selectedCollection.address,
            tokenUri,
            royalty * 10,
            supply,
            chainId,
            library.getSigner()
          );
        if (isCreated) {
          toast.success("NFT " + t("product is created"));
          dispatch(settingUpNftCreateModal(false))
          setIsUploaded(false);
          setIsMinted(false)
          dispatch(setShareNftCreatedModal(true))
          //toast.dismiss(load_toast_id);
        } else {
          dispatch(settingUpNftCreateModal(false))
          toast.error("NFT " + t("create failed"));
          //toast.dismiss(load_toast_id);
          setIsUploaded(false);
          setIsMinted(false)
        }
      }
    } catch (err) {
      console.log(err);
      dispatch(settingUpNftCreateModal(false))
      //toast.dismiss(load_toast_id);
      toast.error("NFT " + t("create failed"));
      setIsUploaded(false);
      setIsMinted(false)
    }
  }

  const closeSettingUpNftModal = () => {
    dispatch(settingUpNftCreateModal(false))
    setPercentage2(0)
    setPercentage1(0)
  }

  useEffect(() => {
    if (loginStatus) fetchCollections();
  }, [loginStatus]);


  /**
   * Get all collections with userinfo
   */
  async function fetchCollections() {
    axios
      .get(`/api/collection`, {
        params: {
          owner: account?.toLowerCase(),
          type: NFT_ERC_TYPES[nftType]["id"],
        },
      })
      .then((res) => {
        setCollections(res.data.collections);
      })
      .catch((err) => { });
  }

  const showCreateCollectionModal = () => {
    dispatch(setCollectionCreateModal(true))
  }

  const inputHandler = (e, type) => {
    const inputName = e.target.name;
    const value = e.target.value;
    switch (inputName) {
      case 'display':
        setNewCollection({ ...newCollection, display: value })
        break;
      case 'brand':
        setNewCollection({ ...newCollection, brand: value })
        break;
      case 'shorturl':
        let url = collectionUrlPrefix + value.substr(collectionUrlPrefix.length)
        setNewCollection({ ...newCollection, shorturl: url })
        break;
      case 'desc':
        setNewCollection({ ...newCollection, desc: value })
        break;
      case 'file':
        let file = e.target.files[0];
        let data = (file.type === 'video/mp4') ? null : file
        setNewCollection({ ...newCollection, file: { ...file, type: file.type, data: data } })
        break;
      case 'nft-name':
        setName(value)
        break;
      case 'nft-description':
        setDescription(value)
        break;
      case 'nft-royalty':
        setRoyalty(value)
        break;
      case 'nft-supply':
        setSupply(value)
        break;
      default:
        break;
    }
  }

  const nftFileHandler = (e, type) => {
    let file = e.target.files[0];
    if (file.type.includes('video') || file.type.includes("audio")) {
      setNftFile({ ...nftFile, type: file.type.includes('video') ? "video" : "audio", data: file })
    } else {
      if (type === 'thumb') {
        setNftFile({ ...nftFile, thumb: file })
      } else {
        setNftFile({ ...nftFile, type: "image", data: file })
      }
    }
  }

  const cancelNftFile = (type) => {
    if (type === 'thumb') {
      setNftFile({ ...nftFile, thumb: null })
      return
    }
    setNftFile({ nftFile: {} })
  }
  const cancelCollectionFile = (type) => {
    if (type === 'thumb') {
      setNewCollection({ ...newCollection, file: { ...newCollection.file, thumb: null } })
      return
    }
    setNewCollection({ ...newCollection, file: {} })
  }

  const closeCreateCollectionModal = () => {
    dispatch(setCollectionCreateModal(false))
  }
  const closeShareCreatedNftModal = () => {
    dispatch(setShareNftCreatedModal(false))
  }

  const addProperty = () => {
    let newPro = { trait_type: '', value: '' }
    properties.push(newPro);
    setProperties([...properties])
  }

  /**
   * 
   * @returns Create new nft collection
   */
  const createCollection = async () => {
    if (!loginStatus) {
      toast.error("Please connect your wallet correctly!");
      return;
    }
    if (!newCollection.display || !newCollection.brand || !newCollection.desc || !newCollection.shorturl || (newCollection.shorturl === collectionUrlPrefix)) {
      toast.warn("Please fill out all fields.")
      return;
    }
    if (!newCollection.file.data) {
      toast.warn("You didn't upload collection file.")
      return;
    }
    const load_toast_id = toast.loading("Please wait...");
    try {
      const logo_hash = await getIpfsHashFromFile(newCollection.file.data);
      const logo_uri = `https://${process.env.REACT_APP_PINATA_GATEWAY}/ipfs/${logo_hash}`;
      const collectionAddr = await deployCollection(NFT_ERC_TYPES[nftType]["id"], chainId, library.getSigner());
      let metaData = {
        address: collectionAddr,
        logo_uri: logo_uri,
        name: newCollection.display,
        brand: newCollection.brand,
        description: newCollection.desc,
        shorturl: newCollection.shorturl
      };
      if (collectionAddr != "") {
        await axios
          .post(`/api/collection/update/`, metaData)
          .then((res) => {
            fetchCollections();
            toast.success("NFT Collection is Created Successfully");
            toast.dismiss(load_toast_id);
            closeCreateCollectionModal(false);
          })
          .catch((err) => {
            console.log(err);
            toast.dismiss(load_toast_id);
            closeCreateCollectionModal(false)
          });
      } else toast.dismiss(load_toast_id);
    } catch (e) {
      console.log(e);
      toast.dismiss(load_toast_id);
      toast.error("NFT Collection Creation is failed!");
    }
  }

  const onChangeTraitValue = (e, ind) => {
    properties[ind].value = e.target.value
    setProperties([...properties])
  }

  const onChangeTraitType = (e, ind) => {
    properties[ind].trait_type = e.target.value
    setProperties([...properties])
  }

  useEffect(() => {
    if (nftType !== networks[chainId]?.KEY && !SUPPORTED_CHAIN_IDS.includes(chainId)){
      navigate("/dashboard");
    }
  }, [chainId]);

  return (
    <>
      {
        isNotSupported || !loginStatus ? <></> :
          <div className="payment-page h-[1800px]">
            <div className={`${openSettingUpNftModal ? '' : 'hidden'} w-full top-0 opacity-50 h-[2400px] bg-zinc-700 absolute z-50`}
              onClick={() => closeSettingUpNftModal(false)}></div>
            <div className={`${openCreateCollectionModal ? '' : 'hidden'} w-full top-0 opacity-50 h-[2400px] bg-zinc-700 absolute z-50`}
              onClick={() => closeCreateCollectionModal(false)}></div>
            <div className={`${openShareCreatedNftModal ? '' : 'hidden'} w-full top-0 opacity-50 h-[2400px] bg-zinc-700 absolute z-50`}
              onClick={() => closeShareCreatedNftModal(false)}></div>

            <div id="setting-up-modal" tabIndex="-1" aria-hidden="true" className={`${openSettingUpNftModal ? '' : 'hidden'} 
            mx-auto fixed mt-16 sm:mt-32 z-50 w-full md:w-[600px] p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-fit`}>
              <div className="relative w-full h-full md:h-auto p-4">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 sm:px-10 px-3 sm:py-10 py-6 w-full text-center">
                  <div className="px-6 py-4 rounded-t dark:border-gray-600">
                    <h3 className="text-base text-center font-bold text-[#000549] lg:text-2xl dark:text-white">
                      Setting up your minting steps
                    </h3>
                  </div>

                  <div className='sm:px-8 px-2'>
                    <div className='flex px-4 my-4'>
                      <div className='text-center w-8 h-8 mr-2 mt-2'>
                        {isUploaded
                          ?
                          <CircularProgressbar value={100} />
                          :
                          <svg aria-hidden="true" className="inline w-8 mt-1 mr-4 h-10 mx-auto text-gray-200 animate-spin dark:text-gray-600 fill-[#83d225]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                          </svg>
                        }
                      </div>
                      <div>
                        <h3 className='text-[#303C4F] font-semibold m-1 text-left'>Upload</h3>
                        <p className='text-[#6E7B91] font-[500] m-1 text-sm text-left'>Uploading nft art medias to IPFS server</p>
                      </div>
                    </div>

                    <div className='flex px-4 my-4'>
                      <div className='text-center w-8 h-8 mr-2 mt-2'>
                        {isMinted
                          ?
                          <CircularProgressbar value={100} />
                          :
                          isUploaded ?
                            <svg aria-hidden="true" className="inline w-8 mt-1 mr-4 h-10 mx-auto text-gray-200 animate-spin dark:text-gray-600 fill-[#83d225]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg> :
                            <CircularProgressbar value={0} />
                        }

                      </div>
                      <div>
                        <h3 className='text-[#303C4F] font-semibold m-1 text-left'>Mint</h3>
                        <p className='text-[#6E7B91] font-[500] m-1 text-sm text-left'>Minting on blockchain with wallet</p>
                      </div>
                    </div>
                  </div>
                  <button className='bg-[#F0F2F4] rounded-lg py-3 px-4 w-2/3 font-[500] text-[#303C4F] mx-auto mt-6' onClick={closeSettingUpNftModal}>Cancel</button>
                </div>
              </div>
            </div>

            <div id="share-nft-modal" tabIndex="-1" aria-hidden="true" className={`${openShareCreatedNftModal ? '' : 'hidden'} mx-auto fixed mt-16 sm:mt-32 z-50 w-full sm:w-[600px] p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-fit`}>
              <div className="relative w-full h-full md:h-auto p-4">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 sm:px-10 px-3 sm:py-12 py-6 w-full text-center">
                  <div className="px-6 py-4 rounded-t dark:border-gray-600">
                    {nftFile.data && <img src={URL.createObjectURL(nftFile?.type === "image" ? nftFile?.data : nftFile?.thumb)} className='w-full' alt='B' />}
                    
                  </div>
                  <div className='text-center px-4 my-4'>
                    {/* <p className='text-[#6E7B91] text-lg text-center'>Your <a className='text-[#531CA6] font-bold' href='#'>{name} </a>NFT is successfully created. It will be mited in blockchain while purchaing or transferrring</p> */}
                    <p className='text-[#6E7B91] text-lg text-center'>Your <a className='text-[#531CA6] font-bold' href='#'>{name} </a>NFT is successfully created.</p>
                  </div>
                  <h3 className='text-center font-bold text-[#303C4F] text-lg mt-6'>Share to</h3>
                  <div className='sm:px-8 px-2 grid grid-cols-4 my-4'>
                    <img src="/imgs/share-facebook-icon.png" role='button' alt='B' />
                    <img src="/imgs/share-twitter-icon.png" role='button' alt='B' />
                    <img src="/imgs/share-telegram-icon.png" role='button' alt='B' />
                    <img src="/imgs/share-clipboard-icon.png" role='button' onClick={() => { navigator.clipboard.writeText('created-nft-link') }} alt='B' />
                  </div>
                  <button className='bg-[#F0F2F4] rounded-lg py-3 px-4 w-full text-[#303C4F] font-bold mx-auto mt-6' onClick={() => navigate('/dashboard')}>View NFT</button>
                </div>
              </div>
            </div>

            <div id="create-collection-modal" tabIndex="-1" aria-hidden="true" className={`${openCreateCollectionModal ? '' : 'hidden'} mx-auto absolute mt-4 sm:mt-40 z-50 w-full md:w-[600px] m-8 h-fit md:inset-0 md:h-fit`}>
              <div className="relative w-full h-full md:h-auto p-4">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 sm:px-10 p-4 w-full text-center">
                  <div className="px-6 py-4 rounded-t dark:border-gray-600 mt-3">
                    <h3 className="text-base text-center font-semibold text-[#000549] lg:text-2xl dark:text-white">
                      Collection {isSingle ? "ERC-721" : "ERC-1155"}
                    </h3>
                  </div>
                  <p className='text-[#303C4F] mt-8 font-semibold text-left'>Load image</p>
                  <p className='text-[#6E7B91] my-1 text-left font-[500]'>Recommended minimum size 350 x 350 px.</p>
                  {newCollection.file.data ?
                    <div className='relative border rounded m-2'>
                      <button className='border rounded-full h-8 w-8 z-10 absolute top-1 right-1' onClick={cancelCollectionFile}><i className='fa fa-close mb-[1px]'></i></button>
                      <img src={URL.createObjectURL(newCollection.file.data)} className='w-full h-auto' alt='B' />
                    </div>
                    :
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="dropzone-file2" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                          <p className="mb-2 text-gray-500 dark:text-gray-400 font-[500]"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-gray-500 dark:text-gray-400 font-[500]">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file2" type="file" className="hidden font-[500] " onChange={(e) => inputHandler(e)} name='file' />
                      </label>
                    </div>
                  }

                  <p className='text-[#303C4F] sm:mt-4 mt-2 font-semibold my-1 text-left'>Display Name</p>
                  <input onChange={inputHandler} name='display' value={newCollection.display} className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-1 sm:py-3 text-[#6E7B91] focus:shadow-md font-[500] shadow-indigo-500/40 focus:outline-none' placeholder='Collection name' />
                  <p className='text-[#303C4F] sm:mt-4 mt-2 font-semibold my-1 text-left'>Brand name</p>
                  <input onChange={inputHandler} name='brand' value={newCollection.brand} className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-1 sm:py-3 text-[#6E7B91] focus:shadow-md font-[500] shadow-indigo-500/40 focus:outline-none' placeholder='Brand name' />
                  <p className='text-[#303C4F] sm:mt-4 mt-2 font-semibold my-1 text-left'>Description</p>
                  <textarea onChange={inputHandler} name='desc' value={newCollection.desc} className='rounded-lg w-full focus:border-[#864FD9] h-28 border border-[#D3D8DE] px-4 py-1 sm:py-3 text-[#6E7B91] focus:shadow-md font-[500] shadow-indigo-500/40 focus:outline-none' placeholder='Collection name' />
                  {/* <p className='text-[#303C4F] sm:mt-4 mt-2 font-semibold mt-8 text-left'>Short URL</p>
                  <input onChange={inputHandler} name='shorturl' value={newCollection.shorturl} className='rounded-lg w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-1 sm:py-3 text-[#6E7B91] focus:shadow-md font-[500] shadow-indigo-500/40 focus:outline-none' placeholder='https://kocoon.app/collection/' /> */}
                  <button className='bg-[#6823D0] rounded-lg py-1 sm:py-3 mb-6 px-4 w-full text-white mx-auto mt-4 font-[500]' onClick={createCollection}>Create Collection</button>
                </div>
              </div>
            </div>

            <div className='py-5 px-32 w-full h-18 border-b'>
              <img src='/imgs/logo.png' alt="A" />
            </div>
            <div className=' bg-[#FAFAFA] h-fit py-2'>
              <div className='sm:mt-24 mt-10 w-full md:px-60 px-2 block sm:flex-1 justify-center'>
                <div className='mt-2 sm:mt-0'>
                  <h1 className='w-full text-center font-bold text-[26px] text-[#000549]'>Create New NFT</h1>
                  <p className='my-2 text-lg text-center text-[#6E7B91] font-[500]'>{NFT_ERC_TYPES[nftType].name} edition on {networks[chainId]?.name}</p>
                </div>
              </div>
              <div className='mx-auto my-4 sm:my-8 w-[360px] sm:w-[460px]'>
                <p className='text-[#303C4F] font-semibold'>Choose wallet</p>
                <div className='p-4 rounded-lg border flex justify-between mt-8'>
                  <div className='flex'>
                    <img src={loginStatus && networks[chainId]?.LOGO} className='h-9 w-9 mr-3' alt='B' />
                    <div>
                      <p className='text-[#303C4F] font-semibold'>{loginStatus && account && truncateWalletString(account)}</p>
                      <span className='text-[#303C4F] text-sm font-[500]'>{loginStatus && account && networks[chainId]?.NAME}</span>
                    </div>
                  </div>
                  <button className='rounded-full border-0 bg-[#1CB23C] px-4 text-sm py-1 text-white'>{loginStatus ? "Connected" : "Disconnected"}</button>
                </div>
                <p className='text-[#303C4F] mt-8 font-semibold'>Upload file</p>
                {nftFile.data ?
                  <div className='relative border rounded m-2'>
                    <button className='border rounded-full h-8 w-8 z-10 absolute top-1 right-1 font-[500]' onClick={cancelNftFile}><i className='fa fa-close mb-[1px]'></i></button>
                    {
                      nftFile.type === 'video' ?
                        <video className='w-full h-auto' controls>
                          <source src={URL.createObjectURL(nftFile.data)} type="video/mp4" />
                        </video>
                        :
                        <img src={URL.createObjectURL(nftFile.data)} className='w-full h-auto' alt='B' />
                    }
                  </div>
                  :
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file1" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-[500]"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-gray-500 dark:text-gray-400 font-[500]">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                      <input id="dropzone-file1" type="file" className="hidden" onChange={nftFileHandler} name='nftfile' />
                    </label>
                  </div>
                }
                {nftFile.data && nftFile.type === 'video' ?
                  nftFile.thumb ?
                    <div className='relative border rounded m-2'>
                      <button className='border rounded-full h-8 w-8 z-10 absolute top-1 right-1' onClick={() => cancelNftFile('thumb')}><i className='fa fa-close mb-[1px]'></i></button>
                      <img src={URL.createObjectURL(nftFile.thumb)} className='w-full h-auto' alt='B' />
                    </div>
                    :
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="dropzone-file3" className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center py-1">
                          <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Video Thumbnail Image</p>
                        </div>
                        <input id="dropzone-file3" type="file" className="hidden" onChange={(e) => nftFileHandler(e, 'thumb')} name='nftfile' />
                      </label>
                    </div>
                  :
                  <></>
                }

                <p className='text-[#303C4F] mt-8 font-semibold'>Choose collection</p>
                <div className='flex'>
                </div>
                <div className='grid grid-cols-3'>
                  <div className='m-2 rounded-lg border h-36 cursor-pointer hover:border-[#6823d0] p-4 text-center bg-whtie' onClick={showCreateCollectionModal} role='button'>
                    <img src='/imgs/add-circle.png' className='w-8 mx-auto' alt='B' />
                    <p className='text-[#000549] text-sm my-3 font-semibold' >Create</p>
                    <p className='text-[#6E7B91] text-sm my-3 font-[500]'>{NFT_ERC_TYPES[nftType]["name"]} Collection</p>
                  </div>
                  {
                    collections.length > 0
                      ? collections.map((collection, ind) => {
                        return (
                          <div
                            className={`m-2 rounded-lg border h-36 cursor-pointer hover:border-[#6823d0] p-4 text-center bg-whtie ${selectedCollection?.address === collection?.address ? 'border-[#6823d0]' : ''}`}
                            key={ind} onClick={() => {
                              setSelectedCollection(collection);
                            }}>
                            <img src={collection.logo_uri} className='w-8 mx-auto' alt='B' />
                            <p className='text-[#000549] text-sm my-3 font-semibold'>{collection.name}</p>
                            <p className='text-[#6E7B91] text-sm my-3 font-[500]'>{collection.brand}</p>
                          </div>
                        )
                      })
                      :
                      <div className='m-2 rounded-lg border h-36 cursor-pointer hover:border-[#6823d0] p-4 text-center bg-whtie'>
                        <img src='/imgs/logo-icon.png' className='w-8 mx-auto' alt='B' />
                        <p className='text-[#000549] text-sm my-3 font-semibold'>Kocoon</p>
                        <p className='text-[#6E7B91] text-sm my-3'>KCN</p>
                      </div>
                  }
                </div>

                {false && <div className='flex justify-between mt-6'>
                  <div>
                    <p className='text-[#000549] text my-3 font-semibold'>Free minting</p>
                    <p className='text-[#6E7B91] text-sm my-3'>Buyer will pay gas fees for minting</p>
                  </div>
                  <label
                    htmlFor="toogleA"
                    className="flex items-center cursor-pointer"
                  >
                    <div className="relative">
                      <input id="toogleA" type="checkbox" className="sr-only" onChange={() => setFreeMint(!freeMint)} checked={freeMint} />
                      <div className="w-14 h-8 bg-[#6823D0] rounded-full shadow-inner"></div>
                      <div className="dot absolute w-6 h-6 bg-white rounded-full shadow left-1 top-1 transition"></div>
                    </div>
                  </label>
                </div>}
                <p className='text-[#303C4F] mt-4 font-semibold my-1'>Name</p>
                <input className='rounded-lg font-[500] w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' onChange={inputHandler} value={name} name='nft-name' placeholder='Name' />

                <p className='text-[#303C4F] mt-4 font-semibold my-1'>Description</p>
                <textarea className='rounded-lg font-[500] w-full focus:border-[#864FD9] h-28 border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' onChange={inputHandler} value={description} name='nft-description' placeholder='Add your description here' />

                {
                  nftType === "multi" && <>
                    <p className='text-[#303C4F] mt-4 font-semibold my-1'>Supply</p>
                    <input className='rounded-lg font-[500] w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' onChange={inputHandler} value={supply} name='nft-supply' placeholder='10' type={'number'} />
                  </>
                }

                <p className='text-[#303C4F] mt-4 font-semibold my-1'>Royalty</p>
                <input className='rounded-lg font-[500] w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' onChange={inputHandler} value={royalty} name='nft-royalty' placeholder='10%' type={'number'} />

                <button className='text-[#303C4F] rounded-lg bg-[#F0F2F4] px-4 py-3 w-full mt-8 font-[500]' onClick={() => { setShowAdvancedSettings(!showAdvancedSettings) }}>Show Advance Settings</button>

                {showAdvancedSettings && <>
                  {properties.map((val, ind) => {
                    return (
                      <div className='mt-4 flex' key={ind + 'pro'}>
                        <input className='rounded-lg font-[500] w-1/2 m-1 focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none'
                          placeholder='trait_type' onChange={(e) => onChangeTraitType(e, ind)} value={val.trait_type} />
                        <input className='rounded-lg font-[500] w-1/2 m-1 focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none'
                          placeholder='value' onChange={(e) => onChangeTraitValue(e, ind)} value={val.value} />
                      </div>
                    )
                  })}

                  <button className='flex w-44 mt-4'>
                    <i className='fa fa-plus text-[#6823D0] py-1'></i>
                    <span className='text-[#6823D0] ml-2 font-semibold max-w-max cursor-pointer' onClick={addProperty}>Add more properties</span>
                  </button>

                  <p className='text-[#303C4F] mt-4 font-semibold my-1'>Alternative text for NFT</p>
                  <input className='rounded-lg font-[500] w-full focus:border-[#864FD9] border border-[#D3D8DE] px-4 py-3 text-[#6E7B91] focus:shadow-md shadow-indigo-500/40 focus:outline-none' placeholder='image description in details' />
                  <p className='text-[#6E7B91] text-sm my-3 font-[500]'>Text that will be used in VoiceOver for people with disabilities.</p></>
                }
                <button className='text-white bg-[#6823D0] rounded-lg px-4 py-3 w-full mt-4 font-[500]' onClick={showSettingUpNftModal}>Create Item</button>
              </div>
            </div>
          </div >
      }
    </>

  );
}

export default CreateNewNft;
