import '@ethersproject/shims';
import { BigNumber, ethers } from 'ethers';
import { toast } from 'react-toastify';
import { getContractInfo, getContractObj, Networks, networks } from '.';
import { BNBStakingInfo, NFTStakingInfo } from './types';

export function isAddress(address) {
  try {
    ethers.utils.getAddress(address);
  } catch (e) {
    return false;
  }
  return true;
}

export function toEth(amount) {
  return ethers.utils.formatEther(String(amount));
}

export function toWei(amount) {
  return ethers.utils.parseEther(String(amount));
}

export async function getBalanceOfBoredM(chainId, provider, account) {
  const BoredMContract = getContractObj('BoredMToken', chainId, provider);
  try {
    const BoredMDecimals = await BoredMContract.decimals();
    const balanceBoredM = await BoredMContract.balanceOf(account);
    return parseFloat(ethers.utils.formatUnits(balanceBoredM, BoredMDecimals));
  } catch (e) {
    console.log(e);
    return 0;
  }
}

export async function getBalanceOfBNB(library, account) {
  try {
    const balanceBNB = await library.getBalance(account);
    return parseFloat(ethers.utils.formatEther(balanceBNB));
  } catch (e) {
    console.log(e);
    return 0;
  }
}

export async function getDistributorInfo(chainId){
  const jsonProvider = new ethers.providers.JsonRpcProvider(networks[chainId].NODES);
  const _contract = getContractObj("PixiaDistributor", chainId, jsonProvider);
  try {
    const LPBurn = await _contract.getAvailableEthAutoLPandBuyBackBurn();
    const StakingCaller = await _contract.getAvailableEthtPerWallet();
    return [
      ethers.utils.formatEther(LPBurn[0]), 
      ethers.utils.formatEther(LPBurn[1]), 
      ethers.utils.formatEther(StakingCaller[1]),
      ethers.utils.formatEther(StakingCaller[3])
    ];
  } catch (e) {
    const revertMsg = JSON.parse(JSON.stringify(e))["reason"];
    if (revertMsg) toast.error(revertMsg.replace("execution reverted: ", ""));
    return ["0", "0", "0", "0"];
  }
}

export async function onFuelUp(chainId, provider){
  const jsonProvider = new ethers.providers.JsonRpcProvider(networks[chainId].NODES);
  const _contract = getContractObj("PixiaDistributor", chainId, provider);
  try {
    const tx = await _contract.triggerDistribution();
    await tx.wait(1);
    return true;
  } catch (e) {
    const revertMsg = JSON.parse(JSON.stringify(e))["reason"];
    if (revertMsg) toast.error(revertMsg.replace("execution reverted: ", ""));
    return false;
  }
}

export async function getMintInfo() {
  const jsonProvider = new ethers.providers.JsonRpcProvider(networks[Networks.ETH_MainNet].NODES);
  const nftContract = getContractObj("BoredMNFT", Networks.ETH_MainNet, jsonProvider);
  try {
    const packPrices = await Promise.all([
      nftContract.SILVER_PACK_PRICE(),
      nftContract.GOLD_PACK_PRICE(),
      nftContract.PREMIUM_PACK_PRICE()
    ]);
    const _packPrices = [
      ethers.utils.formatEther(packPrices[0]),
      ethers.utils.formatEther(packPrices[1]),
      ethers.utils.formatEther(packPrices[2]),
    ]
    return _packPrices;
  } catch (e) {
    const revertMsg = JSON.parse(JSON.stringify(e))["reason"];
    if (revertMsg) toast.error(revertMsg.replace("execution reverted: ", ""));
    return ["0", "0", "0"];
  }
}

export async function onMintArtItem(chainId, provider, reqId, packId, packPrice) {
  const nftContract = getContractObj("BoredMNFT", chainId, provider);
  try {
    const tx =
      packId == 0 ? await nftContract.mintSilverPack(reqId, { value: ethers.utils.parseEther(packPrice) }) :
        packId == 1 ? await nftContract.mintGoldPack(reqId, { value: ethers.utils.parseEther(packPrice) }) :
          await nftContract.mintPremiumPack(reqId, { value: ethers.utils.parseEther(packPrice) });
    await tx.wait(1);
    return true;
  } catch (e) {
    const revertMsg = JSON.parse(JSON.stringify(e))["reason"];
    if (revertMsg) toast.error(revertMsg.replace("execution reverted: ", ""));
    return false;
  }
}

export async function isTokenApprovedForStaking(account, amount, chainId, provider) {
  const stakingContract = getContractObj('BoredMStaking', chainId, provider);
  const tokenContract = getContractObj('BoredMToken', chainId, provider);

  const allowance = await tokenContract.allowance(account, stakingContract.address);
  if (BigNumber.from(toWei(amount)).gt(allowance)) {
    return false;
  }
  return true;
}

export async function approveTokenForStaking(chainId, signer) {
  const stakingContract = getContractObj('BoredMStaking', chainId, signer);
  const tokenContract = getContractObj('BoredMToken', chainId, signer);

  const approveAmount = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
  try {
    const approve_tx = await tokenContract.approve(stakingContract.address, approveAmount);
    await approve_tx.wait(1);
    return true;
  } catch (e) {
    const revertMsg = JSON.parse(JSON.stringify(e))["reason"];
    if (revertMsg) toast.error(revertMsg.replace("execution reverted: ", ""));
    return false;
  }
}

export async function getStakingInfo(chainId, account) {
  try {
    const jsonProvider = new ethers.providers.JsonRpcProvider(networks[chainId].NODES);
    const tokenContract = getContractObj('PixiaAi', chainId, jsonProvider);
    const _decimals = await tokenContract.decimals();
    const stakingContract = getContractObj("PixiaStaking", chainId, jsonProvider);
    const [lockedPool, unLockedPool, lockedUser, unLockedUser, lockedPayout, unLockedPayout, tStakedBoredMLock, mClaimedETHLock, mClaimableETHLock, mPercentFree] = await Promise.all([
      stakingContract.totalDividendsFree(),
      stakingContract.totalSharesFree(),
      account ? stakingContract.shares(account) : null,
      account ? stakingContract.getClaimedRewardsFree(account) : BigNumber.from(0),
      account ? stakingContract.getUnclaimedRewardsFree(account) : BigNumber.from(0),
      stakingContract.totalDividendsLock(),
      stakingContract.totalSharesLock(),
      account ? stakingContract.getClaimedRewardsLock(account) : BigNumber.from(0),
      account ? stakingContract.getUnclaimedRewardsLock(account) : BigNumber.from(0),
      stakingContract.dividendsPercentFree(),
      stakingContract.dividendsPercentLock()
    ]);
    // const nftStakingInfo: NFTStakingInfo = {
    //   tDividETH: parseFloat(ethers.utils.formatEther(tDividETH)),
    //   tStakedBoredM: parseFloat(ethers.utils.formatUnits(tStakedBoredM, BoredMDecimals)),
    //   mStakedBoredM: myStakingInfo ? parseFloat(ethers.utils.formatUnits(myStakingInfo.amountFree, BoredMDecimals)) : 0,
    //   mEarnedETH: parseFloat(ethers.utils.formatEther(mClaimedETH.add(mClaimableETH))),
    //   mClaimedETH: parseFloat(ethers.utils.formatEther(mClaimedETH)),
    //   mClaimableETH: parseFloat(ethers.utils.formatEther(mClaimableETH)),
    //   tDividETHLock: parseFloat(ethers.utils.formatEther(tDividETHLock)),
    //   tStakedBoredMLock: parseFloat(ethers.utils.formatUnits(tStakedBoredMLock, BoredMDecimals)),
    //   mStakedBoredMLock: myStakingInfo ? parseFloat(ethers.utils.formatUnits(myStakingInfo.amountLock, BoredMDecimals)) : 0,
    //   mEarnedETHLock: parseFloat(ethers.utils.formatEther(mClaimedETHLock.add(mClaimableETHLock))),
    //   mClaimedETHLock: parseFloat(ethers.utils.formatEther(mClaimedETHLock)),
    //   mClaimableETHLock: parseFloat(ethers.utils.formatEther(mClaimableETHLock)),
    //   mTimestampLock: myStakingInfo ? myStakingInfo.stakeTimestampLock.toNumber() : 0,
    //   mPercentFree: mPercentFree.toNumber(),
    //   mPercentLock: mPercentLock.toNumber()
    // }
    
    // return nftStakingInfo;
    return null;
  } catch (e) {
    const revertMsg = JSON.parse(JSON.stringify(e))["reason"];
    if (revertMsg) toast.error(revertMsg.replace("execution reverted: ", ""));
    return false;
  }
}

export async function onBoredMStake(account, amount, chainId, provider, isFree) {
  try {
    let isApproved = await isTokenApprovedForStaking(account, amount, chainId, provider);
    if (!isApproved) isApproved = await approveTokenForStaking(chainId, provider);
    if (isApproved) {
      const stakingContract = getContractObj('BoredMStaking', chainId, provider);
      const BoredMContract = getContractObj('BoredMToken', chainId, provider);
      const BoredMDecimals = await BoredMContract.decimals();
      const _parsedAmount = ethers.utils.parseUnits(amount.toString(), BoredMDecimals)
      const tx = isFree ? await stakingContract.stakeFree(_parsedAmount) : await stakingContract.stakeLock(_parsedAmount);
      await tx.wait(1)
      return true;
    }
  } catch (e) {
    console.log(e);
    const revertMsg = JSON.parse(JSON.stringify(e))["reason"];
    if (revertMsg) toast.error(revertMsg.replace("execution reverted: ", ""));
    return false;
  }
}

export async function onBoredMUnStake(account, amount, chainId, provider, isFree) {
  try {
    let isApproved = await isTokenApprovedForStaking(account, amount, chainId, provider);
    if (!isApproved) isApproved = await approveTokenForStaking(chainId, provider);
    if (isApproved) {
      const stakingContract = getContractObj('BoredMStaking', chainId, provider);
      const BoredMContract = getContractObj('BoredMToken', chainId, provider);
      const BoredMDecimals = await BoredMContract.decimals();
      const _parsedAmount = ethers.utils.parseUnits(amount.toString(), BoredMDecimals)
      const tx = isFree ? await stakingContract.unstakeFree(_parsedAmount) : await stakingContract.unstakeLock(_parsedAmount);
      await tx.wait(1)
      return true;
    }
  } catch (e) {
    console.log(e);
    const revertMsg = JSON.parse(JSON.stringify(e))["reason"];
    if (revertMsg) toast.error(revertMsg.replace("execution reverted: ", ""));
    return false;
  }
}

export async function onRewardClaim(chainId, provider, isFree) {
  try {
    const stakingContract = getContractObj('BoredMStaking', chainId, provider);
    const tx = isFree ? await stakingContract.claimRewardsFree() : await stakingContract.claimRewardsLock();
    await tx.wait(1)
    return true;
  } catch (e) {
    console.log(e);
    const revertMsg = JSON.parse(JSON.stringify(e))["reason"];
    if (revertMsg) toast.error(revertMsg.replace("execution reverted: ", ""));
    return false;
  }
}

export async function getBNBStakingInfo(account) {
  try {
    const jsonProvider = new ethers.providers.JsonRpcProvider(networks[Networks.BSC_Mainnet].NODES);
    const stakingContract = getContractObj("BNBStaking", Networks.BSC_Mainnet, jsonProvider);
    const [balance, myShares, myEarnedBNB] = await Promise.all([
      stakingContract.getBalance(),
      account ? stakingContract.getMyShares(account) : BigNumber.from(0),
      account ? stakingContract.shareRewards(account) : BigNumber.from(0)
      // stakingContract.getMyShares("0x13320f40470880fb994379c75A00F963803a85E2"),
      // stakingContract.shareRewards("0x13320f40470880fb994379c75A00F963803a85E2"),
    ]);
    const bnbStakingInfo: BNBStakingInfo = {
      balance: parseFloat(ethers.utils.formatEther(balance)),
      myShares: myShares.toNumber(),
      myEarnedBNB: parseFloat(ethers.utils.formatEther(myEarnedBNB)),
    }
    console.log(bnbStakingInfo);
    return bnbStakingInfo;
  } catch (e) {
    const revertMsg = JSON.parse(JSON.stringify(e))["reason"];
    if (revertMsg) toast.error(revertMsg.replace("execution reverted: ", ""));
    return false;
  }
}

export async function onMyBuyShares(refAddress, amount, chainId, provider) {
  try {
    const stakingContract = getContractObj('BNBStaking', chainId, provider);
    const tx = await stakingContract.buyShares(refAddress, {
      value: ethers.utils.parseEther(amount.toString())
    });
    await tx.wait(1)
    return true;
  } catch (e) {
    console.log(e);
    const revertMsg = JSON.parse(JSON.stringify(e))["reason"];
    if (revertMsg) toast.error(revertMsg.replace("execution reverted: ", ""));
    return false;
  }
}

export async function onSellShares(chainId, provider) {
  try {
    const stakingContract = getContractObj('BNBStaking', chainId, provider);
    const tx = await stakingContract.sellShares();
    await tx.wait(1)
    return true;
  } catch (e) {
    console.log(e);
    const revertMsg = JSON.parse(JSON.stringify(e))["reason"];
    if (revertMsg) toast.error(revertMsg.replace("execution reverted: ", ""));
    return false;
  }
}

export async function onInvest(refAddress, chainId, provider) {
  try {
    const stakingContract = getContractObj('BNBStaking', chainId, provider);
    const tx = await stakingContract.Invest(refAddress);
    await tx.wait(1)
    return true;
  } catch (e) {
    console.log(e);
    const revertMsg = JSON.parse(JSON.stringify(e))["reason"];
    if (revertMsg) toast.error(revertMsg.replace("execution reverted: ", ""));
    return false;
  }
}

/**
* createNewCollection(from, name, uri, bPublic, chainId, provider)
* from : SingleFrameFixed / MultiFrameFixed
* name : collection name
* uri : collectioin uri
*/
export async function createNewCollection(chainId, provider) {
  const factoryContract = getContractObj("BoredMFactory", chainId, provider);
  const factoryContractInfo = getContractInfo("BoredMFactory", chainId);
  try {
    const tx = await factoryContract.createCollection();
    const receipt = await tx.wait(2);
    if (receipt.confirmations) {
      const interf = new ethers.utils.Interface(factoryContractInfo.abi);
      const logs = receipt.logs;
      let collectionAddress = "";
      for (let index = 0; index < logs.length; index++) {
        const log = logs[index];
        if (factoryContractInfo.address?.toLowerCase() === log.address?.toLowerCase()) {
          collectionAddress = interf.parseLog(log).args.collection_address?.toLowerCase();
          return collectionAddress;
        }
      }
    }
    return false;
  } catch (e) {
    toast.error(JSON.parse(JSON.stringify(e))["reason"]);
    return false;
  }
}