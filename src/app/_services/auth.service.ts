/* Angular */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) {}

    baseUrl = environment.baseUrl;

    /* Register New User */
    registerUser(payload) {
        return this.http.post<{object}>(this.baseUrl + '/auth/register', payload);
    }

    /* Login Existing User */
    loginUser(payload) {
        return this.http.post(this.baseUrl + '/auth/login', payload);
    }

}
