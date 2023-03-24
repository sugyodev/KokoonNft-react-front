import { combineReducers } from "redux";
import { Auth, Modal, Nft } from "./auth.reducers";

const reducers = combineReducers({
    auth: Auth,
    modal: Modal,
    nft: Nft
})

export default reducers;
