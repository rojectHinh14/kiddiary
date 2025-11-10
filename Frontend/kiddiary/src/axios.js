import axios from "axios";
import _ from "lodash";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      window.location.href = "/login"; 
      return;
    }
    return Promise.reject(err);
  }
);


export default instance;
