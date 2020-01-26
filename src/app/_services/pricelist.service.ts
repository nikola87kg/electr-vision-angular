/* Angular */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/* Environment */
import { environment } from '../../environments/environment';

/* Interface */
export interface PricelistInterface {
    _id: string;
    name: string;
    description: string;
    price: string;
    createdAt: Date;
}
@Injectable({ providedIn: 'root' })

export class PricelistService {

    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /* GET Pricelist */
    get() {
        return this.http.get<PricelistInterface[]>(this.baseUrl + '/pricelist');
    }

    /* POST Pricelist */
    post(payload) {
        return this.http.post<PricelistInterface>(this.baseUrl + '/pricelist', payload);
    }

    /* PUT Pricelist */
    put(id, payload) {
        return this.http.put<PricelistInterface>(this.baseUrl + '/pricelist/' + id, payload);
    }

    /* DELETE Pricelist */
    delete(id) {
        return this.http.delete<PricelistInterface>(this.baseUrl + '/pricelist/' + id);
    }

}
