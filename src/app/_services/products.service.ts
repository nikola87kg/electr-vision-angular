/* Angular */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/* Environment */
import { environment } from '../../environments/environment';

/* Interface */
export interface ProductInterface {
    _id: string;
    name: string;
    slug: string;
    catalog: string;
    counter: number;
    description: string;
    price: string;
    image: string;
    category:  { _id: string, name: string, slug: string };
    group:  { _id: string, name: string, slug: string  };
    brand:  { _id: string, name: string, slug: string };
    vip: boolean;
    createdAt: Date;
}

/* PRODUCT SERVICE */
@Injectable( { providedIn: 'root' })

export class ProductsService {

    baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) {}

    /* GET Products */
    get() {
      return this.http.get<ProductInterface[]>(this.baseUrl + '/products');
    }

    getBySlug(slug) {
        const URL = this.baseUrl + '/products/' + slug;
        return this.http.get<ProductInterface>(URL);
    }

    /* POST Products */
    post(payload) {
        return this.http.post<ProductInterface>(this.baseUrl + '/products', payload);
    }

    /* PUT Products */
    put(id, payload) {
        return this.http.put<ProductInterface>(this.baseUrl + '/products/' + id, payload);
    }

    /* DELETE Products */
    delete(id) {
        return this.http.delete<ProductInterface>(this.baseUrl + '/products/' + id);
    }

    /* POST Product Image */
    postImage(id, file) {
        return this.http.post<{image: string}>(this.baseUrl + '/products/images/' + id, file);
    }
}
