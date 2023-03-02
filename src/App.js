import Routers from './Routes';
import './i18n.js'
import { Provider } from "react-redux";
import { store } from "./store";
import { useAxios } from './hooks/useAxios';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";

import { Web3Modal } from "@web3modal/react";
import { CookiesProvider } from 'react-cookie';
import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi'
import "react-toastify/dist/ReactToastify.css";
import { arbitrum, polygon, goerli } from "wagmi/chains";

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

function App() {
  useAxios();
  const chains = [goerli, arbitrum, mainnet, polygon];

  const { provider, webSocketProvider } = configureChains(
    chains,
    [alchemyProvider({ apiKey: 'yourAlchemyApiKey' }), publicProvider()],
  )

  const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({
      projectId: process.env.REACT_APP_PROJECT_ID,
      version: "1", // or "2"
      appName: "web3Modal",
      chains,
    }),
    provider,
  });

  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: 'wagmi',
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: 'Injected',
          shimDisconnect: true,
        },
      }),
    ],
    provider,
    webSocketProvider,
  })
  
  // Web3Modal Ethereum Client
  const ethereumClient = new EthereumClient(wagmiClient, chains);
  return (
    <>
      <CookiesProvider>
        <Provider store={store}>
          <WagmiConfig client={client}>
            <Routers />
          </WagmiConfig>
        </Provider>
      </CookiesProvider>
      <Web3Modal
        projectId={process.env.REACT_APP_PROJECT_ID}
        ethereumClient={ethereumClient}
      />
    </>
  );
}

export default App;
