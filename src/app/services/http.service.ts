import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../app/environments/environment';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  public token;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
  ) {
    this.token = this.authenticationService.getToken();
  }

  public get(url: string, options: any = {}): Observable<any> {
    return this.http.get(url, options);
  }

  public post(url: string, data: any, options: any = {}): Observable<any> {
    return this.http.post(url, data, options);
  }

  public put(url: string, data: any, options: any = {}): Observable<any> {
    return this.http.put(url, data, options);
  }

  public delete(url: string, options: any = {}): Observable<any> {
    return this.http.delete(url, options);
  }
}
