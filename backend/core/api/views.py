from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


def generate_ai_answer(prompt):
    if not settings.GOOGLE_API_KEY:
        return Response(
            {"detail": "GOOGLE_API_KEY is not configured."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    try:
        import google.generativeai as genai

        genai.configure(api_key=settings.GOOGLE_API_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
    except ImportError:
        return Response(
            {"detail": "Install google-generativeai to use AI requests."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    except Exception as exc:
        return Response(
            {"detail": "AI request failed.", "error": str(exc)},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    return Response({"answer": response.text})


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

