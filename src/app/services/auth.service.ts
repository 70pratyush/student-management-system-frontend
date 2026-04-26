import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl = environment.apiUrl;

    private api = inject(ApiService);
    private router = inject(Router);

    login(payload: { username: string; password: string }) {
        return this.api.post(`${this.baseUrl}/api/login`, payload);
    }

    logout() {
        localStorage.removeItem('TOKEN');
        this.router.navigate(['auth/login']);
    }

    getUsers(): Observable<any> {
        return this.api.get(`${this.baseUrl}/admin/users`, {});
    }

    createUser(payload: any) {
        return this.api.post('/users', payload);
    }

    updateUser(id: number, payload: any) {
        return this.api.put(`/users/${id}`, payload);
    }

    deleteUser(id: string) {
        return this.api.delete(`${this.baseUrl}/admin/users/${id}`);
    }

    decodeJwt(token: string): any | null {
        try {
            const payload = token.split('.')[1];
            const decodedPayload = atob(
                payload.replace(/-/g, '+').replace(/_/g, '/'),
            );
            return JSON.parse(decodedPayload);
        } catch (error) {
            console.error('Invalid JWT token', error);
            return null;
        }
    }

    startAutoLogoutTimer(exp: number) {
        const now = Math.floor(Date.now() / 1000);
        const expiresIn = exp - now;

        if (expiresIn <= 0) {
            this.logout();
            return;
        }

        setTimeout(() => {
            this.logout();
        }, expiresIn * 1000);
    }

    initAuth() {
        const token = localStorage.getItem('TOKEN');
        if (!token) return;

        const payload = this.decodeJwt(token);
        this.startAutoLogoutTimer(payload.exp);
    }
}
