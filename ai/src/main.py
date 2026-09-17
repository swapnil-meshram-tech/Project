# from typing import TypeVar

from fastapi import FastAPI, status

# from pydantic import BaseModel
from routes.chat import chat_router

app = FastAPI()

app.include_router(chat_router)

# T = TypeVar("T")


# class CreateUser(BaseModel):
#     username: str
#     email: str
#     password: str


# class UserResponse(BaseModel):
#     username: str
#     email: str


# class Response[T](BaseModel):
#     status: str
#     message: str
#     data: T


@app.get("/")
def home():
    return {"message": "AI server is running."}



# @app.post(
#     "/create-user",
#     response_model=Response[UserResponse],
#     status_code=status.HTTP_200_OK,
# )
# def create_user(user: CreateUser):
#     return {"status": "success", "message": "User created", "data": user}
