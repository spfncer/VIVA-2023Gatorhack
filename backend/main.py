import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
import azure.cognitiveservices.speech as speechsdk
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import base64
import json
import openai
from pydantic import BaseModel

load_dotenv(".env")
app = FastAPI()
nextChatId = 0

# Prevent CORS BS
origins = ["http://localhost:3000", "http://localhost:4200"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

blend_shape_names = [
    "eyeBlinkLeft",
    "eyeLookDownLeft",
    "eyeLookInLeft",
    "eyeLookOutLeft",
    "eyeLookUpLeft",
    "eyeSquintLeft",
    "eyeWideLeft",
    "eyeBlinkRight",
    "eyeLookDownRight",
    "eyeLookInRight",
    "eyeLookOutRight",
    "eyeLookUpRight",
    "eyeSquintRight",
    "eyeWideRight",
    "jawForward",
    "jawLeft",
    "jawRight",
    "jawOpen",
    "mouthClose",
    "mouthFunnel",
    "mouthPucker",
    "mouthLeft",
    "mouthRight",
    "mouthSmileLeft",
    "mouthSmileRight",
    "mouthFrownLeft",
    "mouthFrownRight",
    "mouthDimpleLeft",
    "mouthDimpleRight",
    "mouthStretchLeft",
    "mouthStretchRight",
    "mouthRollLower",
    "mouthRollUpper",
    "mouthShrugLower",
    "mouthShrugUpper",
    "mouthPressLeft",
    "mouthPressRight",
    "mouthLowerDownLeft",
    "mouthLowerDownRight",
    "mouthUpperUpLeft",
    "mouthUpperUpRight",
    "browDownLeft",
    "browDownRight",
    "browInnerUp",
    "browOuterUpLeft",
    "browOuterUpRight",
    "cheekPuff",
    "cheekSquintLeft",
    "cheekSquintRight",
    "noseSneerLeft",
    "noseSneerRight",
    "tongueOut",
    "headRoll",
    "leftEyeRoll",
    "rightEyeRoll",
]


blends = []
timestamp = 0
timestep = 1 / 60


def update_blends(evt):
    global timestamp
    print(
        "Viseme event received: audio offset: {}ms, viseme id: {}.".format(
            evt.audio_offset / 10000, evt.viseme_id
        )
    )

    animation = evt.animation
    if animation != "":
        animation = json.loads(evt.animation)
        blendshapes = animation["BlendShapes"]
        for shape in blendshapes:
            blend = dict.fromkeys(blend_shape_names)
            for ind, name in enumerate(blend_shape_names):
                blend[name] = shape[ind]

            blends.append({"time": timestamp, "BlendShapes": blend})
            timestamp = timestamp + timestep


def speakIt(text):
    # Config object gets key and region from enviornment variables
    speech_config = speechsdk.SpeechConfig(
        subscription=os.environ.get("AZURE_TTS_API_KEY"),
        region=os.environ.get("SPEECH_REGION"),
    )

    # The language of the voice that speaks.
    # speech_config.speech_synthesis_voice_name = "en-US-JennyNeural"
    speech_synthesizer = speechsdk.SpeechSynthesizer(
        speech_config=speech_config, audio_config=None
    )

    ssml = f"""
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
        <voice name="en-US-JasonNeural">
            <mstts:viseme type="FacialExpression"/>
            {text}
        </voice>
    </speak>
    """

    # result contains the audio data which can be saved as a wav file
    speech_synthesizer.viseme_received.connect(update_blends)
    # speech_synthesizer.synthesis_completed.connect(update_blends)
    result = speech_synthesizer.speak_ssml_async(ssml).get()

    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        print("Speech synthesized for text [{}]".format(text))
        print("Blends: " + str(blends))
        # Build response object using result.audio_data
        response = {
            "audio": base64.b64encode(result.audio_data),
            "text": text,
            "viseme": blends,
        }
        return response
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        print("Speech synthesis canceled: {}".format(cancellation_details.reason))
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            if cancellation_details.error_details:
                print("Error details: {}".format(cancellation_details.error_details))
                print("Did you set the speech resource key and region values?")


@app.get("/speak")
def read_speak(text: str):
    global timestamp
    timestamp = 0
    blends.clear()
    return JSONResponse(content=jsonable_encoder(speakIt(text)))


@app.get("/")
def read_root():
    return {"Hello": "World"}


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
