import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getHeader(requestMethod: string, data = true) {
    let headers: any = {}
    if((['POST', 'PUT', 'PATCH'].indexOf(requestMethod) != -1)) {
      headers['Content-Type'] = 'application/json';
    }
    return new HttpHeaders(headers);
  }

  get(url: string, params?: any) {
    return this.http.get(url, { params });
  }

  post(url: string, body: any) {
    let opt = { headers: this.getHeader('POST', body)}
    return this.http.post(url, body, opt);
  }

  put(url: string, body: any) {
    return this.http.put(url, body);
  }

  delete(url: string) {
    return this.http.delete(url);
  }
}
