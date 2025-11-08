import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

import appReducer from "./appReducer";
import userReducer from "./userReducer";
import adminReducer from "./adminReducer";
import vaccinationSlice from "../slice/vaccinationSlice";
import children from "../slice/childrenSlice";

const persistCommonConfig = {
  storage,
  stateReconciler: autoMergeLevel2,
};

const userPersistConfig = {
  ...persistCommonConfig,
  key: "user",
  whitelist: ["isLoggedIn", "userInfo"],
};

const appPersistConfig = {
  ...persistCommonConfig,
  key: "app",
  whitelist: ["language"],
};
const vaccinationPersist = persistReducer(
  { key: "vaccination", storage, whitelist: ["vaccinesByChildId"] },
  vaccinationSlice
);
const childrenPersist = persistReducer(
  { key: "children", storage, whitelist: ["list", "byId"] },
  children
);

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  app: persistReducer(appPersistConfig, appReducer),
  admin: adminReducer,
  vaccination : vaccinationPersist,
  children : childrenPersist
});

export default rootReducer;
