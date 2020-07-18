/* Angular */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserInterface {
    username: string;
    email: string;
    password: string;
    admin: boolean;
    token: string;
}


@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private http: HttpClient) { }

    token = '';
    baseUrl = environment.apiUrl;

    getToken(): string {
        return localStorage.getItem('auth_token');
    }

    /* Register New User */
    registerUser(payload): Observable<any> {
        return this.http.post(this.baseUrl + '/auth/register', payload);
    }

    /* Login Existing User */
    loginUser(payload): Observable<any> {
        return this.http.post<UserInterface>(this.baseUrl + '/auth/login', payload);
    }

}
