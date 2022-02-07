import { httpRequest } from "../libraries/httpRequest";

export const fetchData = async () => {
  const URL = window.origin + "/data.json";
  try {
    const response = await httpRequest.get(URL);
    const data = await response.data;
    return data;
  } catch (err) {
    console.log(err);
  }
};
