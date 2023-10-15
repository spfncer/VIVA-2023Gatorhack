import os
import openai
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

load_dotenv(".env")
app = FastAPI()
nextChatId = 0

# Load GPT-3 config
with open("context.txt", "r") as f:
    contextf = f.read()

# Initialize OpenAI with your API key from config.py
openai.api_key = os.environ.get("OPENAI_API_KEY")  # Using the imported API_KEY


# class to get the question and conversation id from the request body
class gptRequestBody(BaseModel):
    question: str | None = None
    conversation_ID: str


# route returns next chat id to send back in requests
@app.get("/api/getNextChat")
async def getNextChat():
    global nextChatId
    nextChatId += 1
    return jsonable_encoder({"conversation_ID": nextChatId})


# route that takes in a question and conversation id and returns the answer
@app.post("/api/ask")
async def create_item(item: gptRequestBody):
    return ask_gpt3(item.conversation_ID, item.question)


conversation_history = {}
last_messages = {}


def ask_gpt3(conversation_id: str, question: str):
    global conversation_history
    if not question:
        return jsonable_encoder({"error": "Question not provided"}), 400

    # Construct the full prompt
    full_prompt = f"{contextf}User: {question}\nAssistant:"
    if conversation_id in conversation_history:
        chat_history = conversation_history[conversation_id]
        chat_length = len(chat_history)
        if chat_length >= 1:
            if chat_length >= 3:
                chat_length = 3
            last_three_messages = chat_history[-chat_length:]
            message_history = "\n".join(
                [
                    f"Assistant:{msg['answer']}\nUser:{msg['question']}"
                    for msg in last_three_messages
                ]
            )
            full_prompt = f"{contextf}messageHistory='''\n{message_history}\n''' {question}Assistant:"
        else:
            full_prompt = f"{contextf}User: {question}\nAssistant:"
    else:
        chat_history = []

    if conversation_id in last_messages:
        last_message = last_messages[conversation_id]
    else:
        last_message = ""

    print("Full prompt:", full_prompt)
    # attempt to get answer from gpt-3
    try:
        response = openai.Completion.create(
            prompt=full_prompt,
            engine="text-davinci-002",
            max_tokens=450,
            temperature=0.5,
            stop=None,
            n=1,
        )
        answer = response.choices[0].text.strip()
        answer = answer.split("\n")[0]

        if answer == "":
            answer = "I don't know."
        if answer == last_message:
            # if gpt gives a duplicate answer, try again
            return ask_gpt3(conversation_id, question)

        last_messages[conversation_id] = answer
        chat_history.append({"question": question, "answer": answer})
        conversation_history[conversation_id] = chat_history
        return jsonable_encoder({"answer": answer})

    except Exception as e:
        return jsonable_encoder({"error": f"Error obtaining answer: {str(e)}"}), 500
