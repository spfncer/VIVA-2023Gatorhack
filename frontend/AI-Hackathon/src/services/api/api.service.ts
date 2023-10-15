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
     * Post a query to the backend server
     * @param {string} query the query to send to the server
     * @returns {Observable<any>} an angular observable to subscribe to in order to receive server response
     */
    postQuery(query: string): Observable<any> {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        let params = new HttpParams().set("text", query);
        return this.http.get<any>(`/api/speak`, { headers, params });
    }

}