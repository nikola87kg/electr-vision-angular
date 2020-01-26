/* Angular */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/* Environment */
import { environment } from '../../environments/environment';

/* Interface */
export interface CategoryInterface {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    createdAt: Date;
}

/* CATEGORY SERVICE */
@Injectable({ providedIn: 'root' })

export class CategoriesService {
    constructor(private http: HttpClient) { }

    baseUrl = environment.apiUrl;

    /* GET categories */
    get() {
        return this.http.get<CategoryInterface[]>(this.baseUrl + '/categories');
    }

    getBySlug(slug) {
        const URL = this.baseUrl + '/categories/' + slug;
        return this.http.get<CategoryInterface>(URL);
    }

    /* POST categories */
    post(payload) {
        return this.http.post<CategoryInterface>(this.baseUrl + '/categories', payload);
    }

    /* PUT categories */
    put(id, payload) {
        return this.http.put<CategoryInterface>(this.baseUrl + '/categories/' + id, payload);
    }

    /* DELETE categories */
    delete(id) {
        return this.http.delete<CategoryInterface>(this.baseUrl + '/categories/' + id);
    }

    /* POST Category Image */
    postImage(id, file) {
        return this.http.post<{ image: string }>(this.baseUrl + '/categories/images/' + id, file);
    }
}
