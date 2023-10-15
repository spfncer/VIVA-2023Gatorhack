import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * A service which provides connections to the backend server
 */
@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) { }

    /**
     * Method to test server connection by getting hello world
     */
    getHelloWorld(): Observable<any> {
        return this.http.get<any>(`/api`);
    }

    /**
     * Get the next chat id
     */
    getConversationId() {
        return this.http.get<any>(`/api/api/getNextChat`);
    }

    /**
     * Post a query to the backend server
     * @param {string} query the query to send to the server
     * @returns {Observable<any>} an angular observable to subscribe to in order to receive server response
     */
    postQuery(query: string, conversation_ID: any): Observable<any> {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        console.log(conversation_ID);
        return this.http.post<any>(`/api/api/gptSpeak`, { "question": query, "conversation_ID": conversation_ID }, { headers });
    }

}