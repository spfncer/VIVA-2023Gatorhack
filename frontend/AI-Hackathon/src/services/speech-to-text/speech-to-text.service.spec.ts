import { TestBed } from '@angular/core/testing';
import { SpeechToTextService } from './speech-to-text.service';

import { HttpClientModule } from '@angular/common/http';


describe('SpeechRecognitionService', () => {
    let service: SpeechToTextService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule]
        });
        service = TestBed.inject(SpeechToTextService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});