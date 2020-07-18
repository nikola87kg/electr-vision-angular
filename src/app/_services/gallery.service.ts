import { HttpClient } from '@angular/common/http';
/* Angular */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
/* Environment */
import { environment } from '../../environments/environment';


/* Interface */
export interface GalleryInterface {
    _id: string;
    name: string;
    description: string;
    gallery: string;
    imagePath: string;
    createdAt: Date;
}

/* GALLERY SERVOCE */
@Injectable({ providedIn: 'root' })

export class GalleryService {

    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /* GET Gallery */
    get(): Observable<any> {
        return this.http.get<GalleryInterface[]>(this.baseUrl + '/gallery');
    }

    /* POST Gallery */
    post(payload): Observable<any> {
        return this.http.post<GalleryInterface>(this.baseUrl + '/gallery', payload);
    }

    /* PUT Gallery */
    put(id, payload): Observable<any> {
        return this.http.put<GalleryInterface>(this.baseUrl + '/gallery/' + id, payload);
    }

    /* DELETE Gallery */
    delete(id): Observable<any> {
        return this.http.delete<GalleryInterface>(this.baseUrl + '/gallery/' + id);
    }

    /* POST Gallery Image */
    postImage(id, file): Observable<any> {
        return this.http.post<{ image: string }>(this.baseUrl + '/gallery/images/' + id, file);
    }
}
