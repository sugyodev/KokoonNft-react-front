import { ethers } from "ethers";
import { UnsupportedChainIdError, useWeb3React as useWeb3ReactCore } from "@web3-react/core";
import { useEffect, useState } from "react";
import { ConnectorNames, connectorsByName, injected } from "../utils/web3React";
import { setupNetwork } from "../utils/wallet";
import { connectorLocalStorageKey } from "../utils";

export function useActiveWeb3React() {
  const context = useWeb3ReactCore();
  return context;
}

export function useEagerConnect() {
  const { activate, active } = useWeb3ReactCore(); // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false);
  const connector = window.localStorage.getItem(connectorLocalStorageKey);
  useEffect(() => {
    if (connector && connector !== "") {
      const currentConnector = connectorsByName[connector];
      if (!window.ethereum) {
        window.open("https://metamask.app.link/dapp/app.boredmemes.ai/", "_blank", "noopener noreferrer");
        setTried(true);
      } else {
        if (connector === ConnectorNames.Injected) {
          injected.isAuthorized()
            .then((isAuthorized) => {
              if (isAuthorized) {
                activate(currentConnector, undefined, true).catch((error) => {
                  if (error instanceof UnsupportedChainIdError) {
                    setupNetwork().then((hasSetup) => {
                      if (hasSetup) activate(currentConnector);
                    });
                  } else {
                    // window.localStorage.removeItem(connectorLocalStorageKey)
                  }
                  setTried(true);
                });
              } else {
                setTried(true);
              }
            });
        } else {
          activate(currentConnector);
          setTried(true);
        }
      }
    }

  }, [activate, connector]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3ReactCore(); // specifically using useWeb3React because of what this hook does

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch((e) => {
          console.error("Failed to activate after chain changed", e);
        });
      };

      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((e) => {
            console.error("Failed to activate after accounts changed", e);
          });
        }
      };

      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
    return undefined;
  }, [active, error, suppress, activate]);
}
