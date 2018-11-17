/* Angular */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/* Environment */
import { environment } from '../../environments/environment';

/* Interface */
export interface BrandInterface {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    vip: boolean;
    createdAt: Date;
}

/* BRAND SERVICE */
@Injectable( { providedIn: 'root' })

export class BrandsService {
    constructor(private http: HttpClient) {}

    baseUrl = environment.baseUrl;

    /* GET brands */
    get() {
        return this.http.get<BrandInterface[]>(this.baseUrl + '/brands');
    }

    getBySlug(slug) {
        const URL = this.baseUrl + '/brands/' + slug;
        return this.http.get<BrandInterface>(URL);
    }

    /* POST brands */
    post(payload) {
        return this.http.post<BrandInterface>(this.baseUrl + '/brands', payload);
    }

    /* PUT brands */
    put(id, payload) {
        return this.http.put<BrandInterface>(this.baseUrl + '/brands/' + id, payload);
    }

    /* DELETE brands */
    delete(id) {
        return this.http.delete<BrandInterface>(this.baseUrl + '/brands/' + id);
    }
    /* POST Brand Image */
    postImage(id, file) {
        return this.http.post<{image: string}>(this.baseUrl + '/brands/images/' + id, file);
    }
}
