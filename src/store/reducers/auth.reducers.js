import * as types from "../actions/types";
import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
} from 'wagmi'


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