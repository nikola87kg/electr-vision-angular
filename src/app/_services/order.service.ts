import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface OrderInterface {
    _id?: string;
    name: string;
    phone: string;
    email: string;
    orderList: Array<any>;
    createdAt: Date;
}

@Injectable( { providedIn: 'root' })

export class OrderService {

    baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) {}

    /* GET Orders */
    get() {
        return this.http.get<OrderInterface[]>(this.baseUrl + '/orders');
    }

    /* POST Order */
    post(payload) {
        return this.http.post<OrderInterface>(this.baseUrl + '/orders', payload);
    }

    /* POST Order */
    delete(id) {
        return this.http.delete<OrderInterface>(this.baseUrl + '/orders/' + id);
    }
}
