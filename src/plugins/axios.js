import axios from "axios";
import router from '../router/index.js'

const token = JSON.parse(localStorage.getItem('landing'))
axios.defaults.baseURL = import.meta.env.VITE_API_URL
token ? axios.defaults.headers.common["Authorization"] = 'Bearer ' + token.token : null
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers['Content-Type'] = 'application/json'

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    // useErrorStore().$reset();

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    switch (error.response.status) {
      case 401:
        // router.push({path: '/'})
        // break;
      case 403:
      case 404:
        // router.push({
        //   name: "error",
        //   props: {
        //     error: {
        //       message: error.response.data.message,
        //       status: error.status,
        //     },
        //   },
        // });
        break;
      case 422:
        return error.response.data
        break;
      default:
        // console.log(error.response.data);
    }

    return Promise.reject(error);
  }
);

export default axios;
