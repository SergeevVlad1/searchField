import { type FormEvent, useState } from "react";
import { useSearchMutation } from "../api/use-search-mutation";
import { Input } from "../../../shared/ui/input.ui";

const voiceLanguages = [
  { label: "English", value: "en-US" },
  { label: "Russian", value: "ru-RU" },
  { label: "Spanish", value: "es-ES" },
] as const;

export const SearchForm = () => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [language, setLanguage] = useState("ru-RU");
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

    recognition.lang = language;
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
        <div className="search__bar">
          <button
            aria-label="Голосовой ввод"
            className="search__icon-button search__icon-button--voice"
            disabled={isListening}
            onClick={handleVoiceInput}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="search__icon"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 4a3 3 0 0 0-3 3v5a3 3 0 1 0 6 0V7a3 3 0 0 0-3-3Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M5 11a7 7 0 0 0 14 0M12 18v3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>

          <Input
            aria-label="Сообщение для ИИ"
            className="search__input"
            disabled={searchMutation.isPending}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ask whatever you want"
            type="text"
            value={message}
          />

          <button
            aria-label="Отправить сообщение"
            className="search__icon-button search__icon-button--submit"
            disabled={isSubmitDisabled}
            type="submit"
          >
            <svg
              aria-hidden="true"
              className="search__icon"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="m9 5 7 7-7 7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.6"
              />
            </svg>
          </button>
        </div>

        <label className="search__select-field">
          <span className="search__select-label">Voice language</span>
          <select
            className="search__select"
            disabled={isListening}
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            {voiceLanguages.map((voiceLanguage) => (
              <option key={voiceLanguage.value} value={voiceLanguage.value}>
                {voiceLanguage.label}
              </option>
            ))}
          </select>
        </label>
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
