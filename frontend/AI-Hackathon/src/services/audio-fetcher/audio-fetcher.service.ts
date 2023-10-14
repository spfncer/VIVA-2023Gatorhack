import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AudioFetcherService {

  constructor(private http: HttpClient) { }

  getAudio(message: string){
    return this.http.get('http://localhost:3000/api/speak?text=' + message, {responseType: 'blob'});
  }
}
