import { EMethodHTTP, handleResponse } from "../../../shared/api/base";

var url = "http://127.0.0.1:8000/";

export const provideSearch = async (data: string) => {
  const response = await handleResponse({
    url: `${url}api/search/`,
    data: {
      message: data,
    },
    method: EMethodHTTP.POST,
  });
  return response;
};

export const getSearch = async () => {
  const response = await handleResponse({
    url: `${url}api/search/`,
    method: EMethodHTTP.GET,
  });
  return response
};
