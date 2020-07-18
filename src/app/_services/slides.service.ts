/* Angular */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
/* Environment */
import { environment } from '../../environments/environment';


/* Interface */
export interface SlideInterface {
    _id: string;
    title: string;
    subtitle: string;
    image: string;
    createdAt: Date;
}

/* CATEGORY SERVICE */
@Injectable({ providedIn: 'root' })

export class SlidesService {
    constructor(private http: HttpClient) { }

    baseUrl = environment.apiUrl;

    /* GET slides */
    get(): Observable<any> {
        return this.http.get<SlideInterface[]>(this.baseUrl + '/slides');
    }

    getBySlug(slug): Observable<any> {
        const URL = this.baseUrl + '/slides/' + slug;
        return this.http.get<SlideInterface>(URL);
    }

    /* POST slides */
    post(payload): Observable<any> {
        return this.http.post<SlideInterface>(this.baseUrl + '/slides', payload);
    }

    /* PUT slides */
    put(id, payload): Observable<any> {
        return this.http.put<SlideInterface>(this.baseUrl + '/slides/' + id, payload);
    }

    /* DELETE slides */
    delete(id): Observable<any> {
        return this.http.delete<SlideInterface>(this.baseUrl + '/slides/' + id);
    }

    /* POST Category Image */
    postImage(id, file): Observable<any> {
        return this.http.post<{ image: string }>(this.baseUrl + '/slides/images/' + id, file);
    }
}
