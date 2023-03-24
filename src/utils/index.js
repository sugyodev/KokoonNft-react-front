import { Contract } from '@ethersproject/contracts';
import MKocoonNFTABI from '../contracts/KocoonMarketABI.json';
import SKocoonNFTABI from '../contracts/SKocoonNFTABI.json';
import KocoonFactoryABI from '../contracts/KocoonNFTFactoryABI.json';
import KocoonMarketABI from '../contracts/KocoonMarketABI.json';
import WETHABI from '../contracts/WETHTokenABI.json'

export const connectorLocalStorageKey = "Kocoon_ConnectorId";
export const chainIdLocalStorageKey = "Kocoon_ChainId";

export const Networks = {
  ETH_MainNet: 1,
  ETH_TestNet: 5,
  BSC_Mainnet: 56,
  BSC_Testnet: 97
};
export const SUPPORTED_CHAIN_IDS = process.env.REACT_APP_NODE_ENV === "development" ? 
      [Networks.ETH_TestNet] : 
      [Networks.ETH_MainNet] ;
export const NFT_ERC_TYPES = {
  "single" : {
    "id" : 0,
    "name" : "Single",
    "type" : "ERC721",
  },
  "multi" : {
    "id" : 1,
    "name" : "Multi",
    "type" : "ERC1155",
  },
}
export const CONTRACTS_BY_NETWORK = {
  [Networks.ETH_MainNet]: {

  },
  [Networks.ETH_TestNet]: {
    SKocoonNFT: {
      address: '0x12a2427F66093D8C3Df5bAC4d319880843346cB5',
      abi: SKocoonNFTABI,
    },
    MKocoonNFT: {
      address: '0xA885aFc1F4f66F2241765a1D0d1293976E898B79',
      abi: MKocoonNFTABI,
    },
    KocoonNFTFactory: {
      address: '0xC2F5070C205bA09b84b1a0C4280F5C052A8E1A28',
      abi: KocoonFactoryABI
    },
    KocoonMarket: {
      address: '',
      abi: KocoonMarketABI
    },
    WETH: {
      address: "0x60d4db9b534ef9260a88b0bed6c486fe13e604fc",
      abi: WETHABI
    }
  },
};

export const networks = {
  [Networks.ETH_MainNet]: {
    NETWORK_ID: process.env.REACT_APP_ETH_NETWORK_ID,
    CURRENCY: process.env.REACT_APP_ETH_CURRENCY,
    NETWORK: process.env.REACT_APP_ETH_NETWORK,
    BLOCK_EXPLORER: process.env.REACT_APP_ETH_BLOCK_EXPLORER,
    NODES: process.env.REACT_APP_ETH_NODE_1,
    NAME: "Ethereum",
    KEY: "ethereum",
    LOGO: "/imgs/eth-icon.png",
  },
  [Networks.ETH_TestNet]: {
    NETWORK_ID: process.env.REACT_APP_ETH_NETWORK_ID,
    CURRENCY: process.env.REACT_APP_ETH_CURRENCY,
    NETWORK: process.env.REACT_APP_ETH_NETWORK,
    BLOCK_EXPLORER: process.env.REACT_APP_ETH_BLOCK_EXPLORER,
    NODES: process.env.REACT_APP_ETH_NODE_1,
    NAME: "Goerli",
    KEY: "goerli",
    LOGO: "/imgs/eth-icon.png"
  },
  [Networks.BSC_Mainnet]: {
    NETWORK_ID: process.env.REACT_APP_BSC_NETWORK_ID,
    CURRENCY: process.env.REACT_APP_BSC_CURRENCY,
    NETWORK: process.env.REACT_APP_BSC_NETWORK,
    BLOCK_EXPLORER: process.env.REACT_APP_BSC_BLOCK_EXPLORER,
    NODES: process.env.REACT_APP_BSC_NODE_1,
    NAME: "Binance",
    KEY: "bsc",
    LOGO: "/imgs/bsc-icon.png"
  },
  [Networks.BSC_Testnet]: {
    NETWORK_ID: process.env.REACT_APP_BSC_NETWORK_ID,
    CURRENCY: process.env.REACT_APP_BSC_CURRENCY,
    NETWORK: process.env.REACT_APP_BSC_NETWORK,
    BLOCK_EXPLORER: process.env.REACT_APP_BSC_BLOCK_EXPLORER,
    NODES: process.env.REACT_APP_BSC_NODE_1,
    NAME: "Binance Testnet",
    KEY: "bsc_test",
    LOGO: "/imgs/bsc-icon.png"
  }
}

export function getCurrentNetwork() {
  return parseInt(window.localStorage.getItem(chainIdLocalStorageKey)) || process.env.REACT_APP_ETH_NETWORK_ID;
}

export const baseApiUrl = process.env.REACT_APP_API_URL;

export function getContractInfo(name, chainId = null) {
  //if (!chainId) chainId = currentNetwork;
  const contracts = CONTRACTS_BY_NETWORK?.[chainId ? chainId : getCurrentNetwork()];
  if (contracts) {
    return contracts?.[name];
  } else {
    return null;
  }
}

export function truncateWalletString(walletAddress) {
  if (!walletAddress) return walletAddress;
  const lengthStr = walletAddress.length;
  const startStr = walletAddress.substring(0, 7);
  const endStr = walletAddress.substring(lengthStr - 7, lengthStr);
  return startStr + '...' + endStr;
}

export function numberToString(n1) {
  if (n1) {
    // const cn1 = n1.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    const cn1 = n1.toLocaleString('en-US');
    return cn1;
  } else {
    return '';
  }
}

export function truncateHashString(txhash) {
  if (!txhash) return txhash;
  const lengthStr = txhash.length;
  const startStr = txhash.substring(0, 10);
  const endStr = txhash.substring(lengthStr - 10, lengthStr);
  return startStr + '...' + endStr;
}

export function getContractObj(name, chainId, provider) {
  const info = getContractInfo(name, chainId);
  return !!info && new Contract(info.address, info.abi, provider);
}

export function getCollectionContract(name, address, chainId, provider) {
  // name : SingleNFT / MultipleNFT
  const info = getContractInfo(name, chainId);
  return !!info && new Contract(address, info.abi, provider);
}

export const shorter = str => (str?.length > 8 ? str.slice(0, 6) + '...' + str.slice(-4) : str);



export const setLocalStorageByUserinfo = (userInfo) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
  localStorage.setItem('loginStatus', true)
  localStorage.setItem('expiration', (new Date().getTime() + (86400 * 1000)))
}

export const removeLocalstrage = () => {
  localStorage.clear();
}