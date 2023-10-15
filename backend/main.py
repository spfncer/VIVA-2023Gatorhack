from multiprocessing import context
import os
import openai
import json
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import Response
from fastapi.encoders import jsonable_encoder
from fastapi import Request
from pydantic import BaseModel

load_dotenv(".env")
app = FastAPI()

# Load GPT-3 config
with open("context.txt", "r") as f:
    context = f.read()

# Initialize OpenAI with your API key from config.py
openai.api_key = os.environ.get("OPENAI_API_KEY")  # Using the imported API_KEY


class gptRequestBody(BaseModel):
    question: str | None = None


# @app.route('/ask', methods=['POST'])
@app.post("/api/ask")
async def create_item(item: gptRequestBody):
    return ask_gpt3(item.question)


def ask_gpt3(question: str):
    print("The question is: ")
    print(question)
    if not question:
        return jsonable_encoder({"error": "Question not provided"}), 400

    # Construct the full prompt
    full_prompt = f"{context}User: {question}\nAssistant:"
    print("The full prompt is: ")
    print(full_prompt)

    try:
        response = openai.Completion.create(
            prompt=full_prompt,
            engine="text-davinci-002",
            max_tokens=150,
            temperature=0.5,
            stop=None,
            n=1,
        )
        print("The answers are: ")
        print(response.choices[0].text)
        answer = response.choices[0].text.strip()
        print("The answer is: ")
        print(answer)

        return jsonable_encoder({"answer": answer})

    except Exception as e:
        return jsonable_encoder({"error": f"Error obtaining answer: {str(e)}"}), 500
