import * as types from "./types"

// Wallect Connection Actions
export const updateUserInfo = (userInfo) => dispatch => {
    dispatch({
        type: types.UPDATE_USER_INFO,
        payload: userInfo
    })
}

export const updateWalletInfo = (wallet) => dispatch => {
    dispatch({
        type: types.UPDATE_WALLET_INFO,
        payload: wallet
    })
}

export const setWalletConnectionStatus = (connected) => dispatch => {
    dispatch({
        type: types.SET_WALLET_CONNECTION_STATUS,
        payload: connected
    })
}

// Modal Actions
export const setOpenNftCreateModal = (isopen) => dispatch => {
    dispatch({
        type: types.SET_OPEN_NFT_CREATE_MODAL,
        payload: isopen
    })
}

export const setWeb3Modal = (modal) => dispatch => {
    dispatch({
        type: types.SET_WEB3_MODAL,
        payload: modal
    })
}

export const settingUpNftCreateModal = (modal) => dispatch => {
    dispatch({
        type: types.SET_SETTING_UP_NFT_MODAL,
        payload: modal
    })
}

export const setCollectionCreateModal = (modal) => dispatch => {
    dispatch({
        type: types.SET_CREATE_COLLECTION_MODAL,
        payload: modal
    })
}

export const setShareNftCreatedModal = (modal) => dispatch => {
    dispatch({
        type: types.SET_SHARE_CREATED_NFT_MODAL,
        payload: modal
    })
}

//auth
export const setSendEmailStatus = (data) => dispatch => {
    dispatch({
        type: types.SET_SEND_EMAIL_STATUS,
        payload: data
    })
}
