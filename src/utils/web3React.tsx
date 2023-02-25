import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { ethers } from "ethers";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { getCurrentNetwork, Networks, networks } from "utils";

const POLLING_INTERVAL = 12000;
const chainId = parseInt(getCurrentNetwork(), 10);
const rpcUrl = networks[chainId].NODES;

export enum ConnectorNames {
  Injected = "Injected",
  WalletConnect = "WalletConnect",
  WalletLink = "WalletLink",
}

export const injected = new InjectedConnector({ supportedChainIds: process.env.REACT_APP_NODE_ENV === "production" ? [Networks.ETH_MainNet, Networks.BSC_Mainnet] : [Networks.ETH_TestNet, Networks.BSC_Testnet]});

export const walletconnect = new WalletConnectConnector({
  rpc: process.env.REACT_APP_NODE_ENV === "production" ? {
    [Networks.ETH_MainNet]: networks[Networks.ETH_MainNet].NODES,
    [Networks.BSC_Mainnet]: networks[Networks.BSC_Mainnet].NODES,
  } : {
    [Networks.ETH_MainNet]: networks[Networks.ETH_TestNet].NODES,
    [Networks.BSC_Mainnet]: networks[Networks.BSC_Testnet].NODES
  },
  chainId: chainId,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: rpcUrl,
  appName: "Coinbase Wallet",
  appLogoUrl: "https://images.ctfassets.net/q5ulk4bp65r7/1rFQCqoq8hipvVJSKdU3fQ/21ab733af7a8ab404e29b873ffb28348/coinbase-icon2.svg",
  supportedChainIds: [chainId],
});

export const connectorsByName = {
  Injected: injected,
  WalletConnect: walletconnect,
  WalletLink: walletlink,
};

export const connectors =
  [
    {
      title: "Metamask",
      connectorId: "Injected",
    },
    {
      title: "WalletConnect",
      connectorId: "WalletConnect",
    },
    {
      title: "WalletLink",
      connectorId: "WalletLink",
    },
  ]


export const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};

/**
 * BSC Wallet requires a different sign method
 * @see https://docs.binance.org/smart-chain/wallet/wallet_api.html#binancechainbnbsignaddress-string-message-string-promisepublickey-string-signature-string
 */
declare const window: any;
export const signMessage = async (provider, account, message) => {
  if (window.BinanceChain) {
    const { signature } = await window.BinanceChain.bnbSign(account, message);
    return signature;
  }

  /**
   * Wallet Connect does not sign the message correctly unless you use their method
   * @see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
   */
  if (provider.provider.wc) {
    const wcMessage = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message));
    const signature = await provider.provider.wc.signPersonalMessage([
      wcMessage,
      account,
    ]);
    return signature;
  }

  return provider.getSigner(account).signMessage(message);
};
