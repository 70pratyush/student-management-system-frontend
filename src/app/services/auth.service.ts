import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;

  constructor(private api: ApiService) {}

  login(payload: { username: string; password: string }) {
    return this.api.post(`${this.baseUrl}/api/login`, payload);
  }

  getUsers(): Observable<any> {
    return this.api.get(`${this.baseUrl}/admin/users`, {})
  }

  decodeJwt(token: string): any | null {
    try {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Invalid JWT token', error);
        return null;
    }
}
}