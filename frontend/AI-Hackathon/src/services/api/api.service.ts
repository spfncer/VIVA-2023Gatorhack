import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * A service which provides connections to the backend server
 */
@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient)  {}

    /**
     * Post a query to the backend server
     * @param {string} query the query to send to the server
     * @returns {Observable<any>} an angular observable to subscribe to in order to receive server response
     */
    postQuery(query: string): Observable<any>  {
        return this.http.post<any>(`/api/query`, query);
    }

}