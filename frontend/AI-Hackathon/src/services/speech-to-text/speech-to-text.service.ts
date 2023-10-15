import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare var webkitSpeechRecognition: any;

/**
 * A service which allows for speech-to-text
 */
@Injectable({
    providedIn: 'root'
})
export class SpeechToTextService {
    recognition: any;
    text: string = '';
    tempWords: string = '';

    private speechToTextOn = new BehaviorSubject<boolean>(false);
    private recognizedText = new BehaviorSubject<string>('');
    private timeoutID: any;

    constructor() {
        this.recognition = new webkitSpeechRecognition();
        this.recognition.interimResults = true;
        this.recognition.continuous = true;
        this.recognition.lang = 'en-US';

        this.recognition.addEventListener('result', (e: any) => {
            const transcript = Array.from(e.results)
                .map((result: any) => result[0])
                .map((result) => result.transcript)
                .join('');
            this.tempWords = transcript;
            this.recognizedText.next(transcript || this.text);

            // Set a 1 second timeout to end the recognition
            clearTimeout(this.timeoutID);
            this.timeoutID = setTimeout(() => {
                this.stop();
                this.text = '';
            }, 1000);
        });
    }

    /**
     * Observe if speech to text is on
     * @returns {Observable<boolean>} an observable to see if speech to text is on
     */
    public observeSpeechToTextOn(): Observable<boolean> {
        return this.speechToTextOn.asObservable();
    }

    /**
     * Observe the recognized text
     * @returns {Observable<string>} an observable to see recognized text as it updates
     */
    public observeRecognizedText(): Observable<string> {
        return this.recognizedText.asObservable();
    }

    /**
     * Begin listening for speech recognition
     */
    public start() {
        this.text = '';
        this.recognizedText.next('');
        this.speechToTextOn.next(true);
        this.recognition.start();
        this.recognition.isActive = true;
    }

    /**
     * End listening for speech recognition
     */
    public stop() {
        this.recognition.stop();
        this.recognition.isActive = false;
        this.speechToTextOn.next(false);
    }

    /**
     * Helper function to concatenate the latest word to the recognized text
     */
    private concatenateLatestWord() {
        this.text = (this.text + this.tempWords).trim();
        this.tempWords = '';
    }
}