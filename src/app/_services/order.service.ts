import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderInterface {
    _id?: string;
    name: string;
    phone: string;
    email: string;
    orderList: Array<any>;
    createdAt: Date;
}

@Injectable({ providedIn: 'root' })

export class OrderService {

    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /* GET Orders */
    get(): Observable<any> {
        return this.http.get<OrderInterface[]>(this.baseUrl + '/orders');
    }

    /* POST Order */
    post(payload): Observable<any> {
        return this.http.post<OrderInterface>(this.baseUrl + '/orders', payload);
    }

    /* POST Order */
    delete(id): Observable<any> {
        return this.http.delete<OrderInterface>(this.baseUrl + '/orders/' + id);
    }
}
