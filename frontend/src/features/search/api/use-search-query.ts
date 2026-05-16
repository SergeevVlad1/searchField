import { useMutation, useQuery } from "@tanstack/react-query";
import { getSearch, provideSearch } from "./search";

export const useSearchQuery = () => {
  return useMutation({
    mutationFn: (data: string) => provideSearch(data),
  });
};
