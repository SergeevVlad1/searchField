import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


def generate_ai_answer(prompt):
    if not settings.MISTRAL_API_KEY:
        return Response(
            {"detail": "MISTRAL_API_KEY is not configured."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    payload = {
        "model": settings.MISTRAL_MODEL,
        "messages": [
            {
                "role": "user",
                "content": prompt,
            }
        ],
    }
    request = Request(
        "https://api.mistral.ai/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {settings.MISTRAL_API_KEY}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=30) as response:
            response_data = json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        error_body = exc.read().decode("utf-8")
        return Response(
            {"detail": "AI request failed.", "error": error_body},
            status=status.HTTP_502_BAD_GATEWAY,
        )
    except (URLError, TimeoutError) as exc:
        return Response(
            {"detail": "AI request failed.", "error": str(exc)},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    answer = response_data["choices"][0]["message"]["content"]

    return Response({"answer": answer})


@api_view(["GET", "POST"])
def search(request):
    if request.method == "GET":
        prompt = (
            request.query_params.get("message")
            or request.query_params.get("prompt")
            or request.query_params.get("query")
        )
    else:
        prompt = (
            request.data.get("message")
            or request.data.get("prompt")
            or request.data.get("query")
        )

    if not prompt:
        return Response(
            {"detail": "Send message, prompt, or query."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return generate_ai_answer(prompt)

