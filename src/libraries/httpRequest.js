import axios from "axios";

export const httpRequest = {
  get: async (url) => {
    return await axios.get(url);
  },
  post: async (url, data, config) => {
    return await axios.post(url, data, config);
  },
  delete: async (url, data) => {
    return await axios.delete(url, data);
  },
  patch: async (url, data) => {
    return await axios.patch(url, data);
  },
};
