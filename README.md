# SearchField

SearchField - это full-stack приложение для общения с ИИ через текстовый и голосовой ввод. Пользователь может ввести вопрос вручную или продиктовать его через микрофон, выбрать язык распознавания речи и отправить запрос в backend. Сервер на Django принимает сообщение, передаёт его в Mistral AI API и возвращает готовый ответ на frontend.

Пример современной связки React + TypeScript + Django REST. Frontend построен с разделением по FSD-подходу: общие API-инструменты лежат в shared, логика AI-поиска в features/search, а страница только подключает готовую фичу. Для запросов используется TanStack React Query, а голосовой ввод работает через browser Web Speech API.

Основная цель проекта - показать полный цикл работы с AI API: ввод данных пользователем, отправка запроса на backend, обращение к внешней LLM API, обработка ответа и отображение результата в интерфейсе.


## Features

- Text prompt input with a styled search bar
- Voice input via the browser Web Speech API
- Voice language selector: English, Russian, Spanish
- React Query mutation flow for AI requests
- Django REST endpoint for AI responses
- Mistral AI integration through the Chat Completions API
- FSD-inspired frontend structure

## Tech Stack

**Frontend**

- React
- TypeScript
- Vite
- TanStack React Query
- Axios

**Backend**

- Django
- Django REST Framework
- Mistral AI API
- SQLite for local Django setup

## Project Structure

```text
searchField/
  backend/
    .env
    core/
      manage.py
      api/
      core/
  frontend/
    src/
      features/
      pages/
      shared/
```

## Environment Variables

Create `backend/.env`:

```env
MISTRAL_API_KEY=your_mistral_api_key
MISTRAL_MODEL=mistral-small-latest
```

`MISTRAL_MODEL` is optional. If it is not set, the backend uses `mistral-small-latest`.

Do not commit `.env`. It is ignored by `.gitignore`.

## Backend Setup

From the project root:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install django djangorestframework django-cors-headers
cd core
..\venv\Scripts\python.exe manage.py runserver
```

Backend URL:

```text
http://127.0.0.1:8000/
```

AI endpoint:

```text
POST http://127.0.0.1:8000/api/search/
```

Request body:

```json
{
  "message": "Explain React Query in simple words"
}
```

Response:

```json
{
  "answer": "..."
}
```

## Frontend Setup

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Frontend URL:

```text
http://127.0.0.1:5173/
```

If you use a VPN and `localhost` does not work, open the app through `127.0.0.1`.

## Voice Input

Voice input uses the browser Web Speech API. It works best in Chrome and Edge.

The selected language is passed to `SpeechRecognition.lang`:

- English: `en-US`
- Russian: `ru-RU`
- Spanish: `es-ES`

The browser may ask for microphone permission.

## Useful Commands

Frontend build:

```powershell
cd frontend
npm.cmd run build
```

Django check:

```powershell
cd backend\core
..\venv\Scripts\python.exe manage.py check
```

## Notes

- Mistral API limits depend on your account, workspace, plan, and selected model.
- The frontend sends only text to the backend. Voice is converted to text in the browser.
- The backend returns Mistral errors as `502` with the original API error in the response.
