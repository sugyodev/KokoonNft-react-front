import { Contract } from '@ethersproject/contracts';
import PixiaAiABI from 'contracts/PixiaAiABI.json';
import PixiaNFTABI from 'contracts/PixiaNFTABI.json';
import PixiaNFTFactoryABI from 'contracts/PixiaNFTFactoryABI.json';
import PixiaStakingABI from 'contracts/PixiaStakingABI.json';
import PixiaDistributorABI from 'contracts/PixiaDistributorABI.json';
import { chainIdLocalStorageKey } from 'hooks';

export const Networks = {
  ETH_MainNet: 1,
  ETH_TestNet: 5,
  BSC_Mainnet: 56,
  BSC_Testnet: 97
};

export const CONTRACTS_BY_NETWORK = {
  [Networks.ETH_MainNet]: {
    PixiaAi: {
      address: '0x4f8f53E17Ce053C5877eb17A2DAC2BA3d786b70c',
      abi: PixiaAiABI
    },
    PixiaNFT: {
      address: '0x0a871ace85e1B3fbAe54B742BCA9624fB9250eD5',
      abi: PixiaNFTABI,
    },
    PixiaNFTFactory: {
      address: '0x0a71464443B8D2501b5e74076521c4462DB1F795',
      abi: PixiaNFTFactoryABI
    },
    PixiaStaking: {
      address: '0xC1a1eDca948823b7c6bbbDAE53F3815e44b99430',
      abi: PixiaStakingABI
    },
    PixiaDistributor: {
      address: '0x2aFdDF35b069034Cb867b4749B25813DDB406a40',
      abi: PixiaDistributorABI
    }
  },
  [Networks.ETH_TestNet]: {
    PixiaAi: {
      address: '0x4f8f53E17Ce053C5877eb17A2DAC2BA3d786b70c',
      abi: PixiaAiABI
    },
    PixiaNFT: {
      address: '0x74841159b1721E9EBd3d822254c1Fb56dd5cc091',
      abi: PixiaNFTABI,
    },
    PixiaNFTFactory: {
      address: '0x6CE3849106A8179CfA0ead47Aea715Ce2859C535',
      abi: PixiaNFTFactoryABI
    },
    PixiaStaking: {
      address: '0xE36f3604d2b39b7664FE14a45E0C5D6c85919980',
      abi: PixiaStakingABI
    },
    PixiaDistributor: {
      address: '0x64F087cFdB149A2D6DfB2d62C897946aE5A4D44D',
      abi: PixiaDistributorABI
    }
  },
  [Networks.BSC_Mainnet]: {
    
  }
};


export const networks = {
  [1]: {
    NETWORK_ID: process.env.REACT_APP_ETH_NETWORK_ID,
    CURRENCY: process.env.REACT_APP_ETH_CURRENCY,
    NETWORK: process.env.REACT_APP_ETH_NETWORK,
    BLOCK_EXPLORER: process.env.REACT_APP_ETH_BLOCK_EXPLORER,
    NODES: process.env.REACT_APP_ETH_NODE_1,
  },
  [5]: {
    NETWORK_ID: process.env.REACT_APP_ETH_NETWORK_ID,
    CURRENCY: process.env.REACT_APP_ETH_CURRENCY,
    NETWORK: process.env.REACT_APP_ETH_NETWORK,
    BLOCK_EXPLORER: process.env.REACT_APP_ETH_BLOCK_EXPLORER,
    NODES: process.env.REACT_APP_ETH_NODE_1,
  },
  [56]: {
    NETWORK_ID: process.env.REACT_APP_BSC_NETWORK_ID,
    CURRENCY: process.env.REACT_APP_BSC_CURRENCY,
    NETWORK: process.env.REACT_APP_BSC_NETWORK,
    BLOCK_EXPLORER: process.env.REACT_APP_BSC_BLOCK_EXPLORER,
    NODES: process.env.REACT_APP_BSC_NODE_1,
  },
  [97]: {
    NETWORK_ID: process.env.REACT_APP_BSC_NETWORK_ID,
    CURRENCY: process.env.REACT_APP_BSC_CURRENCY,
    NETWORK: process.env.REACT_APP_BSC_NETWORK,
    BLOCK_EXPLORER: process.env.REACT_APP_BSC_BLOCK_EXPLORER,
    NODES: process.env.REACT_APP_BSC_NODE_1,
  }
}
export function getCurrentNetwork() {
  return window.localStorage.getItem(chainIdLocalStorageKey) || process.env.REACT_APP_ETH_NETWORK_ID;
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

export const shorter = str => (str?.length > 8 ? str.slice(0, 6) + '...' + str.slice(-4) : str);
