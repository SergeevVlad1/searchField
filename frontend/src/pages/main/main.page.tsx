import { useState } from "react";
import { useSearchQuery } from "../../features/search/api/use-search-query";
import { EInputType, Input } from "../../shared/ui/input.ui";

export const MainPage = () => {
  const [dataInp, setDataInp] = useState("");
  const { mutate: search, data, isSuccess, isPending } = useSearchQuery();

  const onHandleClick = (event: string) => {
    search(event);
  };

  return (
    <>
      <Input
        onChange={(e) => setDataInp(e.target.value)}
        type={EInputType.text}
      />
      <button disabled={isPending} onClick={() => onHandleClick(dataInp)}>
        Отправить
      </button>

      {isPending ? <div>...</div> : isSuccess && data?.answer}
    </>
  );
};
