import { type FormEvent, useState } from "react";
import { useSearchMutation } from "../api/use-search-mutation";
import { Input } from "../../../shared/ui/input.ui";

export const SearchForm = () => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const searchMutation = useSearchMutation();

  const trimmedMessage = message.trim();
  const isSubmitDisabled = !trimmedMessage || searchMutation.isPending;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedMessage) {
      return;
    }

    searchMutation.mutate({ message: trimmedMessage });
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Ваш браузер не поддерживает голосовой ввод");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "ru-RU";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setVoiceError("");
    };

    recognition.onerror = () => {
      setVoiceError("Не удалось распознать голос");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    setVoiceError("");
    setIsListening(true);
    recognition.start();
  };

  return (
    <section className="search">
      <form className="search__form" onSubmit={handleSubmit}>
        <Input
          aria-label="Сообщение для ИИ"
          className="search__input"
          disabled={searchMutation.isPending}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Спросите что-нибудь"
          type="text"
          value={message}
        />
        <button
          className="search__button"
          disabled={isListening}
          onClick={handleVoiceInput}
          type="button"
        >
          {isListening ? "Слушаю..." : "Говорить"}
        </button>
        <button
          className="search__button search__button--primary"
          disabled={isSubmitDisabled}
          type="submit"
        >
          {searchMutation.isPending ? "Отправка..." : "Отправить"}
        </button>
      </form>

      {voiceError && <p className="search__error">{voiceError}</p>}
      {searchMutation.isError && (
        <p className="search__error">{searchMutation.error.message}</p>
      )}
      {searchMutation.data?.answer && (
        <article className="search__answer">{searchMutation.data.answer}</article>
      )}
    </section>
  );
};
