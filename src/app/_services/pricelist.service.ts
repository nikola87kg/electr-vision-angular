import { HttpClient } from '@angular/common/http';
/* Angular */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/* Environment */
import { environment } from '../../environments/environment';


/* Interface */
export interface PricelistInterface {
    _id: string;
    name: string;
    priceGroup: PriceGroupInterface;
    price: string;
    createdAt: Date;
}
export interface PriceGroupInterface {
    _id: string;
    name: string;
    image?: string;
    color?: string;
}
@Injectable({ providedIn: 'root' })

export class PricelistService {

    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /* GET Pricelist */
    get(): Observable<any> {
        return this.http.get<PricelistInterface[]>(this.baseUrl + '/pricelist');
    }

    /* GET Pricelist */
    getPriceGroups(): Observable<PriceGroupInterface[]> {
        return of([
            {_id: '1', name: 'Video nadzor', color: 'blue', img: undefined},
            {_id: '2', name: 'Alarm', color: 'red', img: undefined},
            {_id: '3', name: 'Automatizacija kapije', color: 'green', img: undefined},
            {_id: '4', name: 'Interfonski sistem i kontrola pristupa', color: 'orange', img: undefined},
            {_id: '5', name: 'Auto elektronika', color: 'gray', img: undefined},
            {_id: '6', name: 'Ozvučenje', color: 'yellow', img: undefined},
            {_id: '7', name: 'Rasveta', color: 'purple', img: undefined},
            {_id: '8', name: 'Servis', color: 'pink', img: undefined},
        ]);
    }

    /* POST Pricelist */
    post(payload): Observable<any> {
        return this.http.post<PricelistInterface>(this.baseUrl + '/pricelist', payload);
    }

    /* PUT Pricelist */
    put(id, payload): Observable<any> {
        return this.http.put<PricelistInterface>(this.baseUrl + '/pricelist/' + id, payload);
    }

    /* DELETE Pricelist */
    delete(id): Observable<any> {
        return this.http.delete<PricelistInterface>(this.baseUrl + '/pricelist/' + id);
    }

}
