import os
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from groq import Groq
from pydantic import BaseModel, Field


env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=env_path)


router = APIRouter(
    prefix="/chatbot",
    tags=["AI Chatbot"],
)


class ChatHistoryMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    history: list[ChatHistoryMessage] = []


class ChatResponse(BaseModel):
    reply: str


@router.post("/ask", response_model=ChatResponse)
def ask_chatbot(request: ChatRequest):
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is missing. Add it inside backend/.env",
        )

    try:
        client = Groq(api_key=api_key)

        system_prompt = """
You are ArchiFlow AI, an intelligent architecture workflow assistant.

Your role is to help architects, clients, project managers, interior designers,
and construction teams manage architecture projects clearly and professionally.

You can help with:
- project planning
- client requirement analysis
- floor plan suggestions
- interior design ideas
- construction monitoring
- document review guidance
- client feedback response notes
- project risk and delay analysis
- architecture workflow decisions

Rules:
- Give clear, practical, and professional answers.
- Keep the language simple and useful for a student-built SaaS project.
- Give architecture-focused suggestions.
- Do not claim to provide certified structural, legal, or government approval.
- For safety-critical structural decisions, recommend consulting a licensed professional.
"""

        groq_messages = [
            {
                "role": "system",
                "content": system_prompt,
            }
        ]

        for item in request.history[-8:]:
            groq_messages.append(
                {
                    "role": item.role,
                    "content": item.content,
                }
            )

        groq_messages.append(
            {
                "role": "user",
                "content": request.message,
            }
        )

        completion = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=groq_messages,
            temperature=0.4,
            max_completion_tokens=700,
        )

        reply = completion.choices[0].message.content

        return ChatResponse(reply=reply)

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Groq chatbot error: {str(error)}",
        )