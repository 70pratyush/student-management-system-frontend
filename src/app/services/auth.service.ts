import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Leave } from '../models/leave.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
        constructor(private messageService: MessageService) {}

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

    getUserLeave(userId: any): Observable<any>  {
        return this.api.get(`${this.baseUrl}/api/leave_record/${userId}`, {});
    }

    getUsers(): Observable<any> {
        return this.api.get(`${this.baseUrl}/admin/users`, {});
    }

    getAttendance(userId: any): Observable<any> {
        return this.api.get(`${this.baseUrl}/api/attendance/${userId}`, {});
    }

    createAttendance(payload: any) {
        return this.api.post(`${this.baseUrl}/api/attendance`, payload);
    }
    
    updateAttendance(id: string, payload: any) {
        return this.api.put(`${this.baseUrl}/api/attendance/${id}`, payload);
    }

    deleteAttendace(id: string) {
        return this.api.delete(`${this.baseUrl}/api/attendance/${id}`);
    }

    createUser(payload: any) {
        return this.api.post(`${this.baseUrl}/admin/register`, payload);
    }
    
    updateUser(id: string, payload: any) {
        return this.api.put(`${this.baseUrl}/admin/users/${id}`, payload);
    }
    
    deleteUser(id: string) {
        return this.api.delete(`${this.baseUrl}/admin/users/${id}`);
    }
    
    createLeave(payload: any) {
        return this.api.post(`${this.baseUrl}/api/leave_request/`, payload);
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

    show(severity: 'success' | 'info' | 'warning' | 'danger', heading: string, detail: string) {
        return this.messageService.add({ severity: severity, summary: heading, detail: detail });
    }
}
