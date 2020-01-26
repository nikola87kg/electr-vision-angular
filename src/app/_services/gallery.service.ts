/* Angular */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    get() {
        return this.http.get<GalleryInterface[]>(this.baseUrl + '/gallery');
    }

    /* POST Gallery */
    post(payload) {
        return this.http.post<GalleryInterface>(this.baseUrl + '/gallery', payload);
    }

    /* PUT Gallery */
    put(id, payload) {
        return this.http.put<GalleryInterface>(this.baseUrl + '/gallery/' + id, payload);
    }

    /* DELETE Gallery */
    delete(id) {
        return this.http.delete<GalleryInterface>(this.baseUrl + '/gallery/' + id);
    }

    /* POST Gallery Image */
    postImage(id, file) {
        return this.http.post<{ image: string }>(this.baseUrl + '/gallery/images/' + id, file);
    }
}
