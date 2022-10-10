import { create } from "apisauce";
import { useCallback } from "react";
import cache from "../utility/cache";

const apiClient = create({
  baseURL: "https://wpd.brazilsouth.cloudapp.azure.com/api",
});

const get = apiClient.get;
apiClient.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);
 
  if (response.ok) {
    cache.store(url, response.data)
    return response;
  }
  const data =  JSON.parse( await cache.get(url));
  return data ? {ok:true, data} : undefined;
};

export default apiClient;
