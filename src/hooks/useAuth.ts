import { useCallback } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { connectorsByName, ConnectorNames, injected } from '../utils/web3React'
import { connectorLocalStorageKey } from '.'
import { toast } from "react-toastify";
import { setupNetwork } from 'utils/wallet'

const useAuth = () => {
  const { activate, deactivate } = useWeb3React()

  const login = useCallback((connectorID: ConnectorNames) => {
    const connector = connectorsByName[connectorID]
    console.log(connector);
    if (connector) {
      activate(connector, async (error: Error) => {
        if (error instanceof UnsupportedChainIdError) {
          toast.error("Unsupported Network.");
          console.log(error);
          setupNetwork().then((hasSetup) => {
            if (hasSetup) {
              activate(connector);
              // window.localStorage.setItem(connectorLocalStorageKey, connectorID);
            }
          });
        } else if (error instanceof NoEthereumProviderError) {
          toast.error('No provider was found!')
          // window.localStorage.removeItem(connectorLocalStorageKey)
        } else if (
          error instanceof UserRejectedRequestErrorInjected ||
          error instanceof UserRejectedRequestErrorWalletConnect
        ) {
          if (connector instanceof WalletConnectConnector) {
            const walletConnector = connector as WalletConnectConnector
            walletConnector.walletConnectProvider = null
          }
          toast.error('Authorization Error, Please authorize to access your account')
          console.log('Authorization Error, Please authorize to access your account')
          // window.localStorage.removeItem(connectorLocalStorageKey)
        } else {
          toast.error(error.message)
          console.log(error.name, error.message)
          // window.localStorage.removeItem(connectorLocalStorageKey)
        }
      })
    } else {
      toast.error("Can't find connector, The connector config is wrong")
      console.log("Can't find connector", 'The connector config is wrong')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const switchNetwork = useCallback(() => {
    setupNetwork().then((hasSetup) => {
      if (hasSetup) {
        const connector = connectorsByName[window.localStorage.getItem(connectorLocalStorageKey)];
        activate(connector);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { login, switchNetwork, logout: deactivate }
}

export default useAuth
