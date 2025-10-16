import actionTypes from "./actionTypes";
import { persistor } from "../../redux";
export const userLoginSuccess = (userInfo) => ({
  type: actionTypes.USER_LOGIN_SUCCESS,
  userInfo,
});
export const userLoginFail = () => ({
  type: actionTypes.USER_LOGIN_FAIL,
});

export const processLogout = () => {
  persistor.purge(); // xóa toàn bộ dữ liệu persist khỏi localStorage
  return {
    type: actionTypes.PROCESS_LOGOUT,
  };
};
