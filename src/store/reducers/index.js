import { combineReducers } from "redux";
import {Auth, Modal} from "./auth.reducers";

const reducers = combineReducers({
    auth: Auth,
    modal: Modal
})

export default reducers;
