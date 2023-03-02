/* eslint-disable consistent-return */
import { useCallback, useMemo } from 'react'
import { useAccount, useSwitchNetwork as useSwitchNetworkWallet } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading'
import { toast } from 'react-toastify'

export function useSwitchNetwork() {
  const [loading, setLoading] = useSwitchNetworkLoading()
  const {
    switchNetworkAsync: _switchNetworkAsync,
    isLoading: _isLoading,
    switchNetwork: _switchNetwork,
    ...switchNetworkArgs
  } = useSwitchNetworkWallet()
  const { t } = useTranslation()
  const { isConnected, connector } = useAccount()

  const isLoading = _isLoading || loading

  const switchNetworkAsync = useCallback(
    async (chainId) => {
      if (isConnected && typeof _switchNetworkAsync === 'function') {
        if (isLoading) return
        setLoading(true)
        return _switchNetworkAsync(chainId)
          .then((c) => {
            // well token pocket
            if (window.ethereum?.isTokenPocket === true) {
              window.location.reload()
            }
            return c
          })
          .catch(() => {
            // TODO: review the error
            toast.error(t('Error connecting, please retry and confirm in wallet!'))
          })
          .finally(() => setLoading(false))
      }
      return new Promise(() => {

      })
    },
    [isConnected, _switchNetworkAsync, isLoading, setLoading, t],
  )

  const switchNetwork = useCallback(
    (chainId) => {
      if (isConnected && typeof _switchNetwork === 'function') {
        return _switchNetwork(chainId)
      }
    },
    [_switchNetwork, isConnected],
  )

  const canSwitch = useMemo(
    () =>
      isConnected
        ? !!_switchNetworkAsync &&
          connector.id !== 'walletConnect' &&
          !(
            typeof window !== 'undefined' &&
            // @ts-ignore // TODO: add type later
            (window.ethereum?.isSafePal || window.ethereum?.isMathWallet)
          )
        : true,
    [_switchNetworkAsync, isConnected, connector],
  )

  return {
    ...switchNetworkArgs,
    switchNetwork,
    switchNetworkAsync,
    isLoading,
    canSwitch,
  }
}
