import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EmploymentInterface {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  school: string;
  text: string;
  experience: string;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class EmploymentService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /* GET Orders */
  get(): Observable<any> {
    return this.http.get<EmploymentInterface[]>(this.baseUrl + '/employments');
  }

  /* POST Order */
  post(payload): Observable<any> {
    return this.http.post<EmploymentInterface>(this.baseUrl + '/employments', payload);
  }

  /* POST Order */
  delete(id): Observable<any> {
    return this.http.delete<EmploymentInterface>(this.baseUrl + '/employments/' + id);
  }
}
