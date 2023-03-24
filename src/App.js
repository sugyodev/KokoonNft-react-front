import Routers from './Routes';
import './i18n.js'
import { Provider } from "react-redux";
import { store } from "./store";
import { useAxios } from './hooks/useAxios';
import { CookiesProvider } from 'react-cookie';
import "react-toastify/dist/ReactToastify.css";

import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { RefreshContextProvider } from "./context/RefreshContext";
import { Web3ReactManager } from "./hooks/Web3ReactManager";

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  useAxios();

  return (
    <>
      <CookiesProvider>
        <Provider store={store}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ReactManager>
              <RefreshContextProvider>
                <Routers />
              </RefreshContextProvider>
            </Web3ReactManager>
          </Web3ReactProvider>
        </Provider>
      </CookiesProvider>
    </>
  );
}

export default App;
