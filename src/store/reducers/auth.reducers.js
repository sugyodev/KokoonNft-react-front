import axios from "axios";
import { updateUserInfo } from "../actions/auth.actions";
import * as types from "../actions/types";
import { setLocalStorageByUserinfo, removeLocalstrage } from '../../utils'

const auth = {
    walletInfo: {},
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {},
    sendEmailStatus: 'signup'
}

const modal = {
    openCreateNftModal: false,
    openCreateCollectionModal: false,
    openSettingUpNftModal: false,
    openShareCreatedNftModal: false,
    web3Modal: {}
}

const nft = {
    type: 'single'
}

export function Auth(state = auth, action) {
    switch (action.type) {
        case types.UPDATE_USER_INFO:
            return {
                ...state, userInfo: action.payload
            }
        case types.UPDATE_WALLET_INFO:
            return {
                ...state, walletInfo: action.payload
            }
        case types.SET_SEND_EMAIL_STATUS:
            return {
                ...state, sendEmailStatus: action.payload
            }
        default:
            return { ...state };
    }
}

export async function getUser(dispatch, address) {
    axios
        .get(`api/user/${address}`)
        .then(async (res) => {

            dispatch({ type: types.UPDATE_USER_INFO, payload: res.data.user });
        })
        .catch((err) => {
            dispatch({ type: "FETCH_USER_SUCCESS", payload: null });
        });
}

export async function updateUser(dispatch, userId, account, signer) {
    try {
        const signature = await signer.signMessage(
            `By connecting your wallet and using Kocoon, you agree to our Terms of Service and Privacy Policy`
        );
        if (signature) {
            const { data } = await axios.post(`/api/login`, {
                id: userId,
                address: account,
                signature: signature,
            });
            setLocalStorageByUserinfo(data.user)
            if (data.user) {
                dispatch(updateUserInfo({ ...data.user }));
                return true;
            }
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function logOut(dispatch) {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
}

export function Modal(state = modal, action) {
    switch (action.type) {
        case types.SET_OPEN_NFT_CREATE_MODAL:
            return {
                ...state, openCreateNftModal: action.payload
            }
        case types.SET_WEB3_MODAL:
            return {
                ...state, web3Modal: action.payload
            }
        case types.SET_SETTING_UP_NFT_MODAL:
            return {
                ...state, openSettingUpNftModal: action.payload
            }
        case types.SET_CREATE_COLLECTION_MODAL:
            return {
                ...state, openCreateCollectionModal: action.payload
            }
        case types.SET_SHARE_CREATED_NFT_MODAL:
            return {
                ...state, openShareCreatedNftModal: action.payload
            }
        default:
            return { ...state };
    }
}


export function Nft(state = nft, action) {
    switch (action.type) {
        case types.SET_NFT_TYPE:
            return {
                ...state, type: action.payload
            }
        default:
            return { ...state };
    }
}