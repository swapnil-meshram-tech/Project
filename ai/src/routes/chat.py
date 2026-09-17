from fastapi import APIRouter

chat_router = APIRouter(
    prefix = '/api/v2/chat'
)

# @chat_router.post('')