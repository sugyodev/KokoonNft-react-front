import { useWeb3React } from "@web3-react/core";
import { useEagerConnect, useInactiveListener } from "./index";
import { useState, createContext, useEffect } from "react"
import { SUPPORTED_CHAIN_IDS } from "../utils/";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../store/reducers/auth.reducers";
const Web3WalletContext = createContext({
  loginStatus: false,
  setLoginStatus: (val) => { },
  account: null,
  library: null,
  chainId: null,
})

export default Web3WalletContext;
export function Web3ReactManager({ children }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [loginStatus, setLoginStatus] = useState(false);
  const { connector, library, account, active, chainId, activate } = useWeb3React();

  useEffect(() => {
    const isLoggedin = account && library && active && SUPPORTED_CHAIN_IDS.includes(chainId);
    if (isLoggedin && userInfo?.email && !userInfo?.isApproved) {
      const fetchData = async () => {
        return await updateUser(dispatch, userInfo.id, account, library.getSigner());
      }
      const result = fetchData();
      if (!result) return;
    } else {
      setLoginStatus(isLoggedin);
    }
    setLoginStatus(isLoggedin);
  }, [connector, library, account, active, chainId]);

  const value = { loginStatus, setLoginStatus, account, library, chainId }

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager);

  return (
    <Web3WalletContext.Provider value={value}>
      {children}
    </Web3WalletContext.Provider>
  );
}
