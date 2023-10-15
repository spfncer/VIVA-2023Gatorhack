import os
from dotenv import load_dotenv
from fastapi import FastAPI
import azure.cognitiveservices.speech as speechsdk
from azure.cognitiveservices.speech.audio import AudioOutputStream
from fastapi.responses import Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
import base64
import io
import json

load_dotenv(".env")
app = FastAPI()

# Prevent CORS BS
origins = ['http://localhost:3000', 'http://localhost:4200']

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
    "rightEyeRoll"
]


blends = []
timestamp = 0
timestep = 1/60
def update_blends(evt):
    global timestamp
    print("Viseme event received: audio offset: {}ms, viseme id: {}.".format(evt.audio_offset / 10000, evt.viseme_id))
    
    animation = evt.animation
    if animation != "":
        animation = json.loads(evt.animation)
        blendshapes = animation["BlendShapes"]
        for shape in blendshapes:
            blend = dict.fromkeys(blend_shape_names)
            for ind, name in enumerate(blend_shape_names):
                blend[name] = shape[ind]

            blends.append({
                "time" : timestamp, 
                "BlendShapes" : blend
            })
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
    
    ssml = f'''
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
        <voice name="en-US-JasonNeural">
            <mstts:viseme type="FacialExpression"/>
            {text}
        </voice>
    </speak>
    '''

    # result contains the audio data which can be saved as a wav file
    speech_synthesizer.viseme_received.connect(update_blends)
    # speech_synthesizer.synthesis_completed.connect(update_blends)
    result = speech_synthesizer.speak_ssml_async(ssml).get()

    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        print("Speech synthesized for text [{}]".format(text))
        print("Blends: " + str(blends))
        # Build response object using result.audio_data
        response = {
            "audio" : base64.b64encode(result.audio_data),
            "text" : text,
            "viseme" : blends
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
def read_root(text: str):
    global timestamp 
    timestamp = 0
    blends.clear()
    return JSONResponse(content=jsonable_encoder(speakIt(text)))


@app.get("/")
def read_root():
    return {"Hello": "World"}
