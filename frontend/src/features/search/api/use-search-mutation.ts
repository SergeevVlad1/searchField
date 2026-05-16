import { useMutation } from "@tanstack/react-query";
import { createSearchAnswer } from "./search.api";
import type { SearchRequest, SearchResponse } from "./types";

export const useSearchMutation = () => {
  return useMutation<SearchResponse, Error, SearchRequest>({
    mutationFn: createSearchAnswer,
  });
};
