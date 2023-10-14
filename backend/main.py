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

def speakIt(text):
    # Config object gets key and region from enviornment variables
    speech_config = speechsdk.SpeechConfig(
        subscription=os.environ.get("AZURE_TTS_API_KEY"),
        region=os.environ.get("SPEECH_REGION"),
    )

    # The language of the voice that speaks.
    speech_config.speech_synthesis_voice_name = "en-US-JennyNeural"

    speech_synthesizer = speechsdk.SpeechSynthesizer(
        speech_config=speech_config, audio_config=None
    )

    # result contains the audio data which can be saved as a wav file
    result = speech_synthesizer.speak_text_async(text).get()

    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        print("Speech synthesized for text [{}]".format(text))
        # Build response object using result.audio_data
        response = {
            "audio" : base64.b64encode(result.audio_data),
            "text" : "hi",
            "viseme" : "there"
        }
        
        # Response(content=result.audio_data, media_type="audio/wav")
        # response.headers[
        #     "Content-Disposition"
        # ] = "attachment; filename=synthesized_audio.wav"
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
    print(text)
    return JSONResponse(content=jsonable_encoder(speakIt(text)))
    return speakIt(text)


@app.get("/")
def read_root():
    return {"Hello": "World"}
