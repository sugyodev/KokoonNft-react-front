// import { Contract } from '@ethersproject/contracts';
// import MKocoonNFTABI from 'contracts/MKocoonNFTABI.json';
// import MKocoonFactoryABI from 'contracts/MKocoonFactoryABI.json';
// import SKocoonNFTABI from 'contracts/SKocoonNFTABI.json';
// import SKocoonFactoryABI from 'contracts/SKocoonFactoryABI.json';
// import KocoonMarketABI from './contracts/KocoonMarketABI.json'

// export const Networks = {
//   ETH_MainNet: 1,
//   ETH_TestNet: 5,
//   BSC_Mainnet: 56,
//   BSC_Testnet: 97
// };

// export const CONTRACTS_BY_NETWORK = {
//   [Networks.ETH_MainNet]: {

//   },
//   [Networks.ETH_TestNet]: {
//     SKocoonNFT: {
//       address: '',
//       abi: SKocoonNFTABI,
//     },
//     SKocoonNFTFactory: {
//       address: '',
//       abi: SKocoonFactoryABI
//     },
//     MKocoonNFT: {
//       address: '',
//       abi: MKocoonNFTABI,
//     },
//     MKocoonNFTFactory: {
//       address: '',
//       abi: MKocoonFactoryABI
//     },
//     KocoonMarket: {
//       address: '',
//       abi: KocoonMarketABI
//     }
//   },
//   [Networks.BSC_Mainnet]: {

//   }
// };

// export function getContractInfo(name, chainId = null) {
//   //if (!chainId) chainId = currentNetwork;
//   if (!chainId) return null;
//   const contracts = CONTRACTS_BY_NETWORK?.[chainId ? chainId : getCurrentNetwork()];
//   if (contracts) {
//     return contracts?.[name];
//   } else {
//     return null;
//   }
// }

// export function truncateWalletString(walletAddress) {
//   if (!walletAddress) return walletAddress;
//   const lengthStr = walletAddress.length;
//   const startStr = walletAddress.substring(0, 7);
//   const endStr = walletAddress.substring(lengthStr - 7, lengthStr);
//   return startStr + '...' + endStr;
// }

// export const getCurrentNetwork = () => {

// }

// export function numberToString(n1) {
//   if (n1) {
//     // const cn1 = n1.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
//     const cn1 = n1.toLocaleString('en-US');
//     return cn1;
//   } else {
//     return '';
//   }
// }

// export function truncateHashString(txhash) {
//   if (!txhash) return txhash;
//   const lengthStr = txhash.length;
//   const startStr = txhash.substring(0, 10);
//   const endStr = txhash.substring(lengthStr - 10, lengthStr);
//   return startStr + '...' + endStr;
// }

// export function getContractObj(name, chainId, provider) {
//   const info = getContractInfo(name, chainId);
//   return !!info && new Contract(info.address, info.abi, provider);
// }

// export const shorter = str => (str?.length > 8 ? str.slice(0, 6) + '...' + str.slice(-4) : str);



export const setLocalStorageByUserinfo = (userInfo) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
  localStorage.setItem('loginStatus', true)
  localStorage.setItem('expiration', (new Date().getTime() + (86400 * 1000)))
}

export const removeLocalstrage = () => {
  localStorage.clear();
}