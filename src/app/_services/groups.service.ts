/* Angular */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/* Environment */
import { environment } from '../../environments/environment';

/* Interface */
export interface GroupInterface {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    category:  { _id: string, name: string, slug: string };
    createdAt: Date;
}

/* GROUP SERVICE */
@Injectable( { providedIn: 'root' })

export class GroupsService {
    constructor(private http: HttpClient) {}

    baseUrl = environment.baseUrl;

    /* GET groups */
    get() {
        return this.http.get<GroupInterface[]>(this.baseUrl + '/groups');
    }

    getBySlug(slug) {
        const URL = this.baseUrl + '/groups/' + slug;
        return this.http.get<GroupInterface>(URL);
    }

    /* POST groups */
    post(payload) {
        return this.http.post<GroupInterface>(this.baseUrl + '/groups', payload);
    }

    /* PUT groups */
    put(id, payload) {
        return this.http.put<GroupInterface>(this.baseUrl + '/groups/' + id, payload);
    }

    /* DELETE groups */
    delete(id) {
        return this.http.delete<GroupInterface>(this.baseUrl + '/groups/' + id);
    }

    /* POST Group Image */
    postImage(id, file) {
        return this.http.post<{image: string}>(this.baseUrl + '/groups/images/' + id, file);
    }
}
