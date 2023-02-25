// Set of helper functions to facilitate wallet setup

import { getCurrentNetwork, networks } from "utils";

/**
 * Prompt the user to add MATIC as a network on Metamask, or switch to MATIC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
let windowObject = window;
export const setupNetwork = async () => {
  const provider = windowObject.ethereum;
  if (provider) {
    const chainId = parseInt(getCurrentNetwork(), 10);
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
          },
        ],
      });
      return true;
    } catch (error) {
      console.log(networks[chainId]);
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: `${networks[chainId].NETWORK}`,
            nativeCurrency: {
              name: `${networks[chainId].CURRENCY}`,
              symbol: `${networks[chainId].CURRENCY}`,
              decimals: 18,
            },
            rpcUrls: [networks[chainId].NODES],
            blockExplorerUrls: [networks[chainId].BLOCK_EXPLORER],
          },
        ],
      });
    }
  } else {
    console.error(
      "Can't setup the Binance Chain on metamask because window.ethereum is undefined"
    );
    return false;
  }
};

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage
) => {
  const tokenAdded = await windowObject.ethereum.request({
    method: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage,
      },
    },
  });

  return tokenAdded;
};
