import '@ethersproject/shims';
import { BigNumber, ethers } from 'ethers';
import { toast } from 'react-toastify';
import { getCollectionContract, getContractInfo, getContractObj } from '.';

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

/**
 * NFT Contract Management
 */
export async function isNFTApproved(name, collection, to, account, chainId, provider) {
  const toContract = getContractObj(to, chainId, provider);
  const nftToken = getCollectionContract(name, collection, chainId, provider);
  if (!toContract || !nftToken) return false
  return await nftToken.isApprovedForAll(account, toContract.address);
}

export async function setNFTApproval(name, collection, to, chainId, provider) {
  const toContract = getContractObj(to, chainId, provider);
  const nftToken = getCollectionContract(name, collection, chainId, provider);

  if (!toContract || !nftToken) return false
  try {
    const tx = await nftToken.setApprovalForAll(toContract.address, true);
    await tx.wait(1);
    return true;
  } catch (e) {
    console.log(e)
  }
  return false;
}

/**
 * Governance Token Contract Management
 */
export async function getTokenBalance(account, chainId, provider) {
  const Token = getContractObj('Token', chainId, provider);
  if (Token) {
    const balance = await Token.balanceOf(account);
    return parseFloat(ethers.utils.formatEther(balance));
  }
  return 0;
}

export async function getTokenAddress(chainId, provider) {
  const Token = getContractObj('Token', chainId, provider);
  if (Token){
    return Token.address.toLowerCase();
  }else return ethers.constants.AddressZero;
}

export async function isTokenApprovedForMarket(name, account, amount, chainId, provider) {
  const marketContract = getContractObj(name, chainId, provider);
  const tokenContract = getContractObj('Token', chainId, provider);

  const allowance = await tokenContract.allowance(account, marketContract.address);
  if (BigNumber.from(toWei(amount)).gt(allowance)) {
    return false;
  }
  return true;
}

export async function approveTokenForMarket(name, chainId, signer) {
  const marketContract = getContractObj(name, chainId, signer);
  const tokenContract = getContractObj('Token', chainId, signer);

  const approveAmount = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
  try {
    const approve_tx = await tokenContract.approve(marketContract.address, approveAmount);
    await approve_tx.wait(1);
    return true;
  } catch (e) {
    toast.error(JSON.parse(JSON.stringify(e))["reason"]);
    return false;
  }
}

export async function getTokenId(isMulti, collection, chainId, provider){
  const contractObj = getCollectionContract(isMulti ? 'SKocoonNFT' : 'MKocoonNFT', collection, chainId, provider);
  if (!contractObj) return false;
  try{
    const [tokenId] = await Promise.all([contractObj.generateTokenId()]);
    return tokenId.toNumber();
  }catch(e){
    toast.error(JSON.parse(JSON.stringify(e))["reason"]);
    return false;
  }
}

// Add item to SKocoonNFT collection contract
export async function addSingleItem(collection, uri, royalty, chainId, provider) {
  console.log(collection, uri, royalty, chainId, provider);
  const contractObj = getCollectionContract('SKocoonNFT', collection, chainId, provider);
  if (!contractObj) return false
  try {
    console.log(contractObj);
    const tx = await contractObj.purchaseItem(uri, royalty);
    const receipt = await tx.wait(1);
    if (receipt.confirmations) {
      return true;
    }
    return false;
  } catch (e) {
    toast.error(JSON.parse(JSON.stringify(e))["reason"]);
    return false;
  }
}
// Add item to MKocoonNFT collection contract
export async function addMultiItem(collection, uri, royalty, supply, chainId, provider) {
  console.log(collection, uri, royalty, supply, chainId, provider)
  const contractObj = getCollectionContract('MKocoonNFT', collection, chainId, provider);
  if (!contractObj) return false
  try {
    console.log(uri, supply, royalty);
    const tx = await contractObj.purchaseItem(uri, supply, royalty)
    const receipt = await tx.wait(2);
    if (receipt.confirmations) {
      //     const interf = new ethers.utils.Interface(contractInfo.abi);
      //     const logs = receipt.logs;
      //     let tokenId = 0;
      //     for(let index = 0; index < logs.length; index ++) {
      //       const log = logs[index];
      //       if(collection.toLowerCase() === log.address?.toLowerCase()) {
      //         tokenId = interf.parseLog(log).args.id.toNumber();
      //         return tokenId;
      //       }
      //     }
      return true;
    }
    return false;
  } catch (e) {
    toast.error(JSON.parse(JSON.stringify(e))["reason"]);
    return false;
  }
}
// transfer SKocoonNFT nft item
export async function transferSingleItem(collection, from, to, tokenId, chainId, provider) {
  const collectionContract = getCollectionContract('SKocoonNFT', collection, chainId, provider);
  try {
    const tx = await collectionContract["safeTransferFrom(address,address,uint256)"](from, to, tokenId);
    const receipt = await tx.wait(1);
    return receipt.confirmations;
  } catch (e) {
    toast.error(JSON.parse(JSON.stringify(e))["reason"]);
    return false;
  }
}
// transfer MKocoonNFT nft item
export async function transferMultiItem(collection, from, to, tokenId, amount, chainId, provider) {
  const collectionContract = getCollectionContract('MKocoonNFT', collection, chainId, provider);
  var data = [];
  try {
    const tx = await collectionContract["safeTransferFrom(address,address,uint256,uint256,bytes)"](from, to, tokenId, amount, data);
    const receipt = await tx.wait(1);
    return receipt.confirmations;
  } catch (e) {
    toast.error(JSON.parse(JSON.stringify(e))["reason"]);
    return false;
  }
}

/**
* Market Contract Management
*/
export async function onBuyTransaction(chainId, provider, transaction, buySig, item, mintSig, isMulti){
  const marketContract = getContractObj('KocoonMarket', chainId, provider)
  if (!marketContract) return false
  try {
    console.log(transaction, buySig, item, mintSig)
    const _mintSig = transaction.isLazyMint ?  mintSig : buySig;
    const tx = await marketContract.onBuyOrder(transaction, buySig, item, _mintSig, isMulti, {
      value: (transaction._price * transaction._amount).toString()
    })
    const receipt = await tx.wait(2);
    return receipt.confirmations;
  } catch (e) {
    toast.error(JSON.parse(JSON.stringify(e))["reason"]);
    return false
  }
}

export async function onAcceptTransaction(chainId, provider, transaction, buySig, item, mintSig, isMulti){
  const marketContract = getContractObj('KocoonMarket', chainId, provider)
  if (!marketContract) return false
  try {
    console.log(transaction, buySig, item, mintSig)
    const _mintSig = transaction.isLazyMint ?  mintSig : buySig;
    const tx = await marketContract.onAcceptOffer(transaction, buySig, item, _mintSig, isMulti)
    const receipt = await tx.wait(2);
    return receipt.confirmations;
  } catch (e) {
    toast.error(JSON.parse(JSON.stringify(e))["reason"]);
    return false
  }
}
/**
* Collection Contract Management
*/

/**
 * deployCollection(nftType, chainId, provider)
 * nftType: the value that identifies ERC721 or ERC1155 NFT Collection
 *          0 : ERC721, 1: ERC1155
 */ 
export async function deployCollection(nftType, chainId, provider) {
  const factoryContract = getContractObj("KocoonNFTFactory", chainId, provider);
  const factoryContractInfo = getContractInfo("KocoonNFTFactory", chainId);
  try {
    const tx = await factoryContract.deployCol(nftType);
    const receipt = await tx.wait(1);
    if (receipt.confirmations) {
      const interf = new ethers.utils.Interface(factoryContractInfo.abi);
      const logs = receipt.logs;
      let collectionAddress = "";
      for (let index = 0; index < logs.length; index++) {
        const log = logs[index];
        if (factoryContractInfo.address?.toLowerCase() === log.address?.toLowerCase()) {
          collectionAddress = interf.parseLog(log).args._colAddress?.toLowerCase();
          return collectionAddress;
        }
      }
    }
    return false;
  } catch (e) {
    console.log(e);
    toast.error(JSON.parse(JSON.stringify(e))["reason"]);
    return false;
  }
}