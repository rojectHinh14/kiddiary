import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

import appReducer from "./appReducer";
import userReducer from "./userReducer";
import adminReducer from "./adminReducer";
import vaccinationSlice from "../slice/vaccinationSlice";
import children from "../slice/childrenSlice";
import childHistorySlice from "../slice/childHistoorySlice"; 
import childMilk from "../slice/childMilkSlice"
import sleepReducer from "../slice/sleepSlice"

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
const childHistoryPersist = persistReducer(
  {
    key: "childHistory",
    storage,
    whitelist: ["childId", "list"], 
  },
  childHistorySlice
);

const childMilkPersist = persistReducer(
  {
    key: "childMilk",
    storage,
    whitelist: ["childId", "date", "logs", "totalToday", "last7Days"],
  },
  childMilk
);
const sleepPersist = persistReducer(
  {
    key: "sleep",
    storage,
    whitelist: ["week", "history"],  
  },
  sleepReducer
);

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  app: persistReducer(appPersistConfig, appReducer),
  admin: adminReducer,
  vaccination : vaccinationPersist,
 childHistory: childHistoryPersist,
  children : childrenPersist,
  childMilk : childMilkPersist,
  childSleep: sleepPersist,  
});

export default rootReducer;
