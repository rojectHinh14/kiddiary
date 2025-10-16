import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import logger from "redux-logger";
import rootReducer from "./store/reducers/rootReducer";

const environment = import.meta.env.MODE || "development";
const isDevelopment = environment === "development";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(isDevelopment ? [logger] : []),

  devTools: isDevelopment,
});

export const persistor = persistStore(store);
export const dispatch = store.dispatch;
export default store;
