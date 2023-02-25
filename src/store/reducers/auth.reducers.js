import * as types from "../actions/types";

const auth = {
    walletInfo: {},
    userInfo: {},
    walletConnected: false
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
        case types.SET_WALLET_CONNECTION_STATUS:
            return {
                ...state, walletConnected: action.payload
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