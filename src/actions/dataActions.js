import { httpRequest } from "../libraries/httpRequest";

export const fetchData = async () => {
  const URL = process.env.DATA_URL;
  console.log(process.env.DATA_URL);
  try {
    const response = await httpRequest.get(URL);
    const data = await response.data;
    return data;
  } catch (err) {
    console.log(err);
  }
};
