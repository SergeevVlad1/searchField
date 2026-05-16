import { apiRequest } from "../../../shared/api/client";
import type { SearchRequest, SearchResponse } from "./types";

export const createSearchAnswer = (data: SearchRequest) => {
  return apiRequest<SearchResponse>({
    url: "/api/search/",
    method: "POST",
    data,
  });
};
