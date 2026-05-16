import axios from "axios";

export enum EMethodHTTP {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

interface IResponse<T> {
  url: string;
  data?: T;
  method: EMethodHTTP;
}

export const handleResponse = async <T>({
  url,
  data,
  method,
}: IResponse<T>) => {
  try {
    const response = await axios(url, {
      headers: {
        "Content-Type": "application/json",
      },
      data,
      method,
    });

    if (response.status === 200 && response.data !== 0) {
      return response.data;
    }
  } catch (e: unknown) {
    throw new Error("Error");
  }
};
